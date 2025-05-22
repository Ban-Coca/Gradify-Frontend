export function PseudoTrendChart({ allGrades = [], classes = [] }) {
  // Sort grades by classId (or use another property for order if available)
  const sortedGrades = [...allGrades].sort((a, b) => Number(a.classId) - Number(b.classId));

  // Map classId to className for display
  const classIdToName = {};
  classes.forEach(cls => {
    classIdToName[cls.classId] = cls.className;
  });

  if (!sortedGrades.length) {
    return <div className="text-muted-foreground">No grade data available.</div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-end gap-2 w-full py-8">
        {sortedGrades.map((item, idx) => (
            <div key={item.classId} className="flex flex-col items-center flex-1">
            {/* Grade Dot */}
            <div
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mb-2 shadow"
                title={classIdToName[item.classId] || item.classId}
            >
                {item.grade}
            </div>
            {/* Vertical Bar */}
            <div className="w-2 flex-1 bg-green-200 rounded-full" style={{ minHeight: 40, maxHeight: 80 }} />
            {/* Class Name */}
            <span className="text-xs text-center mt-2 truncate w-full">
                {classIdToName[item.classId] || item.classId}
            </span>
            </div>
        ))}
        </div>
      <div className="flex w-full justify-between px-2">
        {sortedGrades.map((item, idx) => (
          <span key={item.classId + "-label"} className="text-xs text-muted-foreground min-w-[80px] text-center truncate">
            {classIdToName[item.classId] || item.classId}
          </span>
        ))}
      </div>
    </div>
  );
}