import { Link, useParams } from "react-router-dom";
import { AxisBadge } from "../components/common/AxisBadge";
import { LevelBadge } from "../components/common/LevelBadge";
import { PageHeader } from "../components/common/PageHeader";
import { LessonRenderer } from "../components/learning/LessonRenderer";
import { learningContent } from "../data/learningContent";
import { learningNodes } from "../data/learningNodes";

export function LessonDetailPage() {
  const { lessonId = "lesson-2a" } = useParams();
  const lesson = learningContent.find((item) => item.id === lessonId) ?? learningContent[2];
  const node = learningNodes.find((item) => item.id === lesson.nodeId)!;

  return (
    <div>
      <PageHeader title="Lesson Detail" eyebrow={node.title}>
        <div className="mt-2 flex flex-wrap gap-2">
          <AxisBadge axis={node.axis} />
          <LevelBadge level={node.targetLevel} />
        </div>
      </PageHeader>
      <div data-tour="lesson-and-lab">
        <LessonRenderer lesson={lesson} />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={`/lab/${node.labId}`} className="rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white">Start Lab / Checkpoint</Link>
          {node.lessonIds.map((id) => (
            <Link key={id} to={`/lesson/${id}`} className="rounded border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Lesson {id.split("-").slice(-1)[0]}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
