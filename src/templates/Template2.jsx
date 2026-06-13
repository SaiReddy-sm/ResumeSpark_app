function Template2({ resumeData }) {
  return (
    <div className="template template-two">
      <div className="template-two-header">
        <h1>{resumeData.name || "Your Name"}</h1>
        <p>
          {resumeData.email || "your.email@example.com"} |{" "}
          {resumeData.phone || "Your Phone Number"}
        </p>
      </div>

      <section>
        <h3>Summary</h3>
        <p>{resumeData.summary || "Write a short summary about yourself here."}</p>
      </section>

      <section>
        <h3>Skills</h3>
        <p>{resumeData.skills || "Add your skills here."}</p>
      </section>

      <section>
        <h3>Education</h3>
        <p>{resumeData.education || "Add your education details here."}</p>
      </section>

      <section>
        <h3>Experience / Projects</h3>
        <p>{resumeData.experience || "Add your experience or project details here."}</p>
      </section>
    </div>
  );
}

export default Template2;