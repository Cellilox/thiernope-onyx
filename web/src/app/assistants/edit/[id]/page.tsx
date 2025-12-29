import { ErrorCallout } from "@/components/ErrorCallout";
import CardSection from "@/components/admin/CardSection";
import AssistantEditor from "@/app/admin/assistants/AssistantEditor";
import { fetchAssistantEditorInfoSS } from "@/lib/assistants/fetchPersonaEditorInfoSS";
import { ProjectsProvider } from "@/app/chat/projects/ProjectsContext";
import PageLayout from "@/refresh-components/layouts/PageLayout";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [values, error] = await fetchAssistantEditorInfoSS(params.id);

  if (!values) {
    return (
      <div className="px-4 md:px-32 py-8">
        <ErrorCallout errorTitle="Something went wrong :(" errorMsg={error} />
      </div>
    );
  } else {
    return (
      <ProjectsProvider>
        <PageLayout className="w-full max-w-[80rem] px-4 md:px-32">
          <div className="w-full py-8">
            <CardSection className="!border-none !bg-transparent !ring-none">
              <AssistantEditor {...values} defaultPublic={false} />
            </CardSection>
          </div>
        </PageLayout>
      </ProjectsProvider>
    );
  }
}
