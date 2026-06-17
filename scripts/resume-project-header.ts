export interface ResumeProjectContext {
  employer?: "Codefrost";
  productOwner?: "codefrost" | "client" | "personal";
  clientBrand?: string;
}

export interface ResumeProjectHeaderInput {
  name: string;
  role: string;
  resumeContext?: ResumeProjectContext;
}

export function formatResumeProjectAttribution(
  resumeContext?: ResumeProjectContext,
): string {
  if (!resumeContext || resumeContext.productOwner === "personal") {
    return "";
  }

  if (
    resumeContext.productOwner === "codefrost" &&
    resumeContext.employer === "Codefrost"
  ) {
    return "(Codefrost)";
  }

  if (
    resumeContext.productOwner === "client" &&
    resumeContext.employer === "Codefrost" &&
    resumeContext.clientBrand
  ) {
    return `(Codefrost · ${resumeContext.clientBrand})`;
  }

  if (resumeContext.productOwner === "client" && resumeContext.clientBrand) {
    return `(${resumeContext.clientBrand})`;
  }

  return "";
}

export function formatResumeProjectHeader(
  project: ResumeProjectHeaderInput,
): string {
  const attribution = formatResumeProjectAttribution(project.resumeContext);
  if (!attribution) {
    return `${project.name} — ${project.role}`;
  }
  return `${project.name} — ${project.role} ${attribution}`;
}

export function formatResumeProjectRoleLine(
  project: Pick<ResumeProjectHeaderInput, "role" | "resumeContext">,
): string {
  const attribution = formatResumeProjectAttribution(project.resumeContext);
  if (!attribution) {
    return project.role;
  }
  return `${project.role} ${attribution}`;
}
