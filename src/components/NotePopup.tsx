interface NotePopupProps {
  note: string;
  x: number;
  y: number;
}

export default function NotePopup({ note, x, y }: NotePopupProps) {
  if (!note) return null;

  return (
    <div
      className="fixed z-[9999] bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-xs whitespace-pre-wrap"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: 'none',
        minWidth: '200px',
        fontSize: '14px',
        lineHeight: '1.5',
        transform: 'translate(20px, -50%)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {note}
    </div>
  );
}
