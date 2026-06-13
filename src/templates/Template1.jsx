function Template1({ resumeData }) {
  return (
    <div className="template template-one">
      <h1>{resumeData.name || "Your Name"}</h1>

      <p className="template-contact">
        {resumeData.email || "your.email@example.com"} |{" "}
        {resumeData.phone || "Your Phone Number"}
      </p>

      <section>
        <h3>Professional Summary</h3>
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

export default Template1;