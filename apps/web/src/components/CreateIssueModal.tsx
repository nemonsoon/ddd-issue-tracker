import {
	Button,
	Group,
	Modal,
	Stack,
	Textarea,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useState } from "react";
import {
	DESCRIPTION_MIN_ROWS,
	ICON_SIZE,
	ICON_STROKE,
	MODAL_OVERLAY,
	NOTIFICATION_DURATION_MS,
} from "../constants";
import { createIssue } from "../lib/issues";

type Props = {
	opened: boolean;
	onClose: () => void;
	onCreated: () => void;
};

export function CreateIssueModal({ opened, onClose, onCreated }: Props) {
	const [submitting, setSubmitting] = useState(false);

	const form = useForm({
		mode: "uncontrolled",
		initialValues: { title: "", description: "" },
		validate: {
			// 空の題名は API も拒むが、往復せずその場で伝える。
			title: (value) => (value.trim() === "" ? "題名を入力してください" : null),
		},
	});

	const close = () => {
		form.reset();
		onClose();
	};

	const handleSubmit = form.onSubmit(async (values) => {
		setSubmitting(true);
		try {
			const issue = await createIssue({
				title: values.title.trim(),
				description: values.description.trim(),
			});
			notifications.show({
				title: "課題を作成しました",
				message: issue.title,
				color: "blue",
				autoClose: NOTIFICATION_DURATION_MS,
				icon: <CircleCheck size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} />,
			});
			onCreated();
			close();
		} catch (error) {
			notifications.show({
				title: "作成できませんでした",
				message: toMessage(error),
				color: "red",
				autoClose: NOTIFICATION_DURATION_MS,
				icon: <CircleAlert size={ICON_SIZE.sm} strokeWidth={ICON_STROKE} />,
			});
		} finally {
			setSubmitting(false);
		}
	});

	return (
		<Modal
			opened={opened}
			onClose={close}
			title="新しい課題"
			centered
			size="lg"
			overlayProps={MODAL_OVERLAY}
		>
			<form onSubmit={handleSubmit}>
				<Stack gap="lg">
					<TextInput
						label="題名"
						placeholder="例: 課題一覧に絞り込みを追加する"
						withAsterisk
						data-autofocus
						key={form.key("title")}
						{...form.getInputProps("title")}
					/>
					<Textarea
						label="説明"
						placeholder="背景や条件があれば書きます"
						minRows={DESCRIPTION_MIN_ROWS}
						autosize
						key={form.key("description")}
						{...form.getInputProps("description")}
					/>
					<Group justify="flex-end" gap="sm">
						<Button
							variant="subtle"
							color="gray"
							onClick={close}
							disabled={submitting}
						>
							キャンセル
						</Button>
						<Button type="submit" loading={submitting}>
							作成する
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}

function toMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: "原因を特定できませんでした。時間をおいて試してください。";
}
