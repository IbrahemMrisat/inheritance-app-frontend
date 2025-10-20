type Props = {
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  busy?: boolean
}

export default function ConfirmBar({
  message,
  confirmText = 'تأكيد الحذف',
  cancelText = 'إلغاء',
  onConfirm,
  onCancel,
  busy = false,
}: Props) {
  return (
    <div className="w-full rounded-xl border border-red-200 bg-red-50 text-red-800 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="flex-1 text-sm sm:text-base">{message}</div>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={busy}
          className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? 'جارٍ الحذف…' : confirmText}
        </button>
        <button
          onClick={onCancel}
          disabled={busy}
          className="px-3 py-1.5 rounded bg-white border hover:bg-gray-50"
        >
          {cancelText}
        </button>
      </div>
    </div>
  )
}
