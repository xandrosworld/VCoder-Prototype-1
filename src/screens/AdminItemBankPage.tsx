import { ItemBankTable } from "../components/admin/ItemBankTable";
import { SeedValidationPanel } from "../components/admin/SeedValidationPanel";
import { PageHeader } from "../components/common/PageHeader";

export function AdminItemBankPage() {
  return (
    <div>
      <PageHeader title="Admin Item Bank" eyebrow="Problem validation">
        Validation rules: MCQ/gate/capstone-MCQ needs answer_key; artifact item needs ground_truth and judge_rubric_ref; axis and difficulty are bounded; payload needs schema_version.
      </PageHeader>
      <ItemBankTable />
      <div className="mt-6">
        <PageHeader title="Seed Validation" />
        <SeedValidationPanel />
      </div>
    </div>
  );
}
