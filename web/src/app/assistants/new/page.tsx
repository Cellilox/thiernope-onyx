import CardSection from "@/components/admin/CardSection";
import AssistantEditor from "@/app/admin/assistants/AssistantEditor";
import { fetchAssistantEditorInfoSS } from "@/lib/assistants/fetchPersonaEditorInfoSS";
import { ErrorCallout } from "@/components/ErrorCallout";
import { ProjectsProvider } from "@/app/chat/projects/ProjectsContext";
import PageLayout from "@/refresh-components/layouts/PageLayout";

export default async function Page() {
  const [values, error] = await fetchAssistantEditorInfoSS();

  if (!values) {
    return (
      <div className="px-4 md:px-32 py-8">
        <ErrorCallout errorTitle="Something went wrong :(" errorMsg={error} />
      </div>
    );
  }

  return (
    <ProjectsProvider>
      <PageLayout className="w-full max-w-[80rem] px-4 md:px-32">
        <div className="w-full py-8">
          <CardSection className="!border-none !bg-transparent !ring-none">
            <AssistantEditor
              {...values}
              defaultPublic={false}
              shouldAddAssistantToUserPreferences={true}
            />
          </CardSection>
        </div>
      </PageLayout>
    </ProjectsProvider>
  );
}
