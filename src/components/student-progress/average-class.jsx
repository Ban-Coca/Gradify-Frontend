export function AveragePerClass({ subject, allGrades = [], allGradesLoading = false, classes = [] }) {

  if (allGradesLoading) {
    return <div>Loading average grades...</div>;
  }

  if (!allGrades.length) {
    return <div className="text-muted-foreground">No grade data available.</div>;
  }

  // Map classId to className for display
  const classIdToName = {};
  classes.forEach(cls => {
    classIdToName[cls.classId] = cls.className;
  });

  // Find the max grade for scaling bar width
  const maxGrade = Math.max(...allGrades.map(item => item.grade), 100);

  return (
    <div className="flex flex-col gap-6">
      {allGrades.map((item) => (
        <div key={item.classId} className="flex items-center gap-4">
          <span className="w-56 font-medium truncate">{classIdToName[item.classId] || item.classId}</span>
          <div className="flex-1 h-6 bg-green-100 rounded-full relative overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{
                width: `${(item.grade / maxGrade) * 100}%`,
                minWidth: 8,
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-green-900 drop-shadow">
              {item.grade}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}