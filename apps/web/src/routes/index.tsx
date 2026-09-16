import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ErrorComponentProps } from "@tanstack/react-router";
import {
	createFileRoute,
	getRouteApi,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { CircleAlert, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { AppShell } from "../components/AppShell";
import { CreateIssueModal } from "../components/CreateIssueModal";
import { Highlights } from "../components/Highlights";
import type { IssueCounts } from "../components/IssueFilter";
import { IssueFilter } from "../components/IssueFilter";
import { IssueList } from "../components/IssueList";
import { IssueListSkeleton } from "../components/IssueListSkeleton";
import { PageHeader } from "../components/PageHeader";
import { ProgressSummary } from "../components/ProgressSummary";
import { StateMessage } from "../components/StateMessage";
import type { Issue, IssueStatus } from "../lib/issues";
import { fetchIssues, isIssueStatus } from "../lib/issues";

type IssueSearch = {
	status?: IssueStatus;
	selected?: string;
};

type PageData = {
	// 進捗と件数は絞り込みに関係なく全件から出す。
	all: Issue[];
	// 一覧に並べるのは、絞り込みを反映した結果。
	visible: Issue[];
};

const PAGE_TITLE = "Issues";
const PAGE_LEAD = "やるべきことを整理し、課題を前に進めましょう。";

const EMPTY_COUNTS: IssueCounts = { all: 0, open: 0, closed: 0 };

const STATUS_LABELS: Record<IssueStatus, string> = {
	open: "Open",
	closed: "Closed",
};

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Route を画面から直に参照すると型の解決が循環するため、経路の入口は getRouteApi で取る。
const route = getRouteApi("/");

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>): IssueSearch => {
		const result: IssueSearch = {};
		if (isIssueStatus(search.status)) {
			result.status = search.status;
		}
		if (
			typeof search.selected === "string" &&
			UUID_PATTERN.test(search.selected)
		) {
			result.selected = search.selected;
		}
		return result;
	},
	// selected は取得に影響しない。依存に入れると課題を選ぶたびに読み込み直しが走る。
	loaderDeps: ({ search }) => ({ status: search.status }),
	loader: ({ deps }) => loadPage(deps.status),
	component: IssuesPage,
	pendingComponent: IssuesPending,
	errorComponent: IssuesError,
});

async function loadPage(status: IssueStatus | undefined): Promise<PageData> {
	if (status === undefined) {
		const all = await fetchIssues();
		return { all, visible: all };
	}

	const [all, visible] = await Promise.all([
		fetchIssues(),
		fetchIssues(status),
	]);
	return { all, visible };
}

function IssuesPage() {
	const { all, visible } = route.useLoaderData();
	const { status, selected } = route.useSearch();
	const router = useRouter();
	const navigate = useNavigate({ from: "/" });
	const [modalOpened, { open, close }] = useDisclosure(false);

	// 詳細に出せるのは一覧に並んでいる課題だけ。並びと詳細の対応を崩さないため。
	const selectedIssue = visible.find((issue) => issue.id === selected);

	const setSelected = (id: string | undefined) => {
		// 行を選ぶだけで履歴を積むと、戻る操作が選択の取り消しで埋まる。
		void navigate({
			to: "/",
			search: (previous) => ({ ...previous, selected: id }),
			replace: true,
		});
	};

	// 共有された URL の識別子が一覧に無ければ、選択を外して通常の右列へ戻す。
	useEffect(() => {
		if (selected !== undefined && selectedIssue === undefined) {
			void navigate({
				to: "/",
				search: (previous) => ({ ...previous, selected: undefined }),
				replace: true,
			});
		}
	}, [selected, selectedIssue, navigate]);

	return (
		<IssuesLayout
			issues={all}
			selected={selectedIssue}
			onClearSelection={() => {
				setSelected(undefined);
			}}
		>
			<PageHeader
				title={PAGE_TITLE}
				lead={PAGE_LEAD}
				onCreate={open}
				filter={
					<IssueFilter
						counts={all.length === 0 ? EMPTY_COUNTS : countIssues(all)}
						activeStatus={status}
					/>
				}
				progress={<ProgressSummary issues={all} />}
			/>

			{visible.length === 0 ? (
				<StateMessage
					icon={Inbox}
					title={
						status === undefined
							? "まだ課題がありません"
							: `${STATUS_LABELS[status]} の課題はありません`
					}
					description="「New issue」からタイトルと説明を登録すると、ここに並びます。"
					action={<Button onClick={open}>New issue</Button>}
				/>
			) : (
				<IssueList
					issues={visible}
					selectedId={selectedIssue?.id}
					onSelect={setSelected}
				/>
			)}

			<CreateIssueModal
				opened={modalOpened}
				onClose={close}
				onCreated={() => {
					void router.invalidate();
				}}
			/>
		</IssuesLayout>
	);
}

function IssuesPending() {
	return (
		<IssuesLayout issues={[]} selected={undefined} onClearSelection={() => {}}>
			<PageHeader
				title={PAGE_TITLE}
				lead={PAGE_LEAD}
				onCreate={undefined}
				filter={<IssueFilter counts={EMPTY_COUNTS} activeStatus={undefined} />}
				progress={<ProgressSummary issues={[]} />}
			/>
			<IssueListSkeleton />
		</IssuesLayout>
	);
}

function IssuesError({ error }: ErrorComponentProps) {
	return (
		<IssuesLayout issues={[]} selected={undefined} onClearSelection={() => {}}>
			<PageHeader
				title={PAGE_TITLE}
				lead={PAGE_LEAD}
				onCreate={undefined}
				filter={<IssueFilter counts={EMPTY_COUNTS} activeStatus={undefined} />}
				progress={<ProgressSummary issues={[]} />}
			/>
			<StateMessage
				icon={CircleAlert}
				tone="alert"
				title="課題を読み込めませんでした"
				description={toMessage(error)}
				action={
					<Button
						variant="default"
						onClick={() => {
							window.location.reload();
						}}
					>
						読み込み直す
					</Button>
				}
			/>
		</IssuesLayout>
	);
}

type LayoutProps = {
	issues: Issue[];
	selected: Issue | undefined;
	onClearSelection: () => void;
	children: ReactNode;
};

function IssuesLayout({
	issues,
	selected,
	onClearSelection,
	children,
}: LayoutProps) {
	return (
		<AppShell
			aside={
				<Highlights
					issues={issues}
					selected={selected}
					onClearSelection={onClearSelection}
				/>
			}
		>
			{children}
		</AppShell>
	);
}

function countIssues(issues: Issue[]): IssueCounts {
	return {
		all: issues.length,
		open: issues.filter((issue) => issue.status === "open").length,
		closed: issues.filter((issue) => issue.status === "closed").length,
	};
}

function toMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: "原因を特定できませんでした。時間をおいて試してください。";
}
