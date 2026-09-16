// アイコンの大きさ。3 段階に揃える。
export const ICON_SIZE = {
	sm: 16,
	md: 24,
	lg: 32,
} as const;

// 線画アイコンの線の太さ。細い区切り線と釣り合う値に揃える。
export const ICON_STROKE = 1.75;

// 相対表記（○日前）から絶対表記へ切り替える日数。
export const RELATIVE_TIME_LIMIT_DAYS = 30;

// 読み込み中に見せる仮の行。長さを変えて実際の一覧に近づける。
// 値は行の鍵も兼ねるため、重複させない。
export const SKELETON_ROW_WIDTHS = ["72%", "56%", "64%", "48%", "40%"] as const;

export const SKELETON_BAR_HEIGHT = 8;

// 右の列に並べる未完了の件数。
export const FOCUS_ITEM_COUNT = 3;

// 完了率を示す円の寸法。見出し帯に収めるため小さく取る。
export const DONUT = {
	size: 64,
	thickness: 8,
} as const;

// 公開リポジトリの住所。画面から出どころをたどれるようにする。
export const REPOSITORY = {
	name: "nemonsoon/ddd-issue-tracker",
	url: "https://github.com/nemonsoon/ddd-issue-tracker",
} as const;

// 説明欄の初期の高さ（行数）。
export const DESCRIPTION_MIN_ROWS = 4;

export const NOTIFICATION_DURATION_MS = 4000;

export const MODAL_OVERLAY = {
	backgroundOpacity: 0.35,
	blur: 2,
} as const;
