import { useEffect, useRef, useState } from "react";
import "./Careers.css";
import { makeRequestCall, makeRegistrationRequestCall } from "../api/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const getDefaultFormData = () => ({
  name: sessionStorage.getItem("name") || "",
  contactNumber: "",
  email: sessionStorage.getItem("email") || "",
  messageToHiringTeam: "",
});

const getPositionKey = (position, index) => {
  if (typeof position === "string") {
    return `${position}-${index}`;
  }

  return String(
    position.id ||
      position.jobId ||
      position.positionId ||
      position.slug ||
      `${position.title || position.name || "position"}-${index}`,
  );
};

const getPositionTitle = (position, index) => {
  if (typeof position === "string") {
    return position;
  }

  return (
    position.position ||
    position.title ||
    position.name ||
    position.positionTitle ||
    `Position ${index + 1}`
  );
};

const getPositionDescription = (position) => {
  if (typeof position === "string") {
    return "Role details will be shared once your application is reviewed.";
  }

  return (
    position.description ||
    position.details ||
    position.summary ||
    "Role details will be shared once your application is reviewed."
  );
};

const fileToBase64 = (file, errorLabel = "uploaded file") =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error(`Unable to read the ${errorLabel}.`));
        return;
      }

      const [, base64Content = ""] = reader.result.split(",");
      resolve(base64Content);
    };

    reader.onerror = () => {
      reject(new Error(`Unable to read the ${errorLabel}.`));
    };

    reader.readAsDataURL(file);
  });

const Careers = () => {
  const [positions, setPositions] = useState([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);
  const [positionsError, setPositionsError] = useState("");
  const [formData, setFormData] = useState(getDefaultFormData);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [submitState, setSubmitState] = useState({
    status: "idle",
    message: "",
  });
  const cvInputRef = useRef(null);
  const coverLetterInputRef = useRef(null);

  const normalizedPositions = positions.map((position, index) => ({
    raw: position,
    optionKey: getPositionKey(position, index),
    title: getPositionTitle(position, index),
    description: getPositionDescription(position),
  }));

  useEffect(() => {
    fetchPositions();
  }, []);

  async function fetchPositions() {
    setIsLoadingPositions(true);
    setPositionsError("");

    try {
      const availablePositions = await getAvailablePositions();
      setPositions(Array.isArray(availablePositions) ? availablePositions : []);
    } catch (error) {
      console.error("Error fetching available positions:", error);
      setPositionsError(
        "Sorry, there was an error loading the available positions. Please try again later.",
      );
    } finally {
      setIsLoadingPositions(false);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
    setFormError("");
    setSubmitState({ status: "idle", message: "" });
  };

  const handlePositionToggle = (positionKey) => {
    setSelectedPositions((currentSelections) =>
      currentSelections.includes(positionKey)
        ? currentSelections.filter((currentKey) => currentKey !== positionKey)
        : [...currentSelections, positionKey],
    );
    setFormError("");
    setSubmitState({ status: "idle", message: "" });
  };

  const handleCvChange = (event) => {
    const [uploadedFile] = event.target.files || [];
    setCvFile(uploadedFile || null);
    setFormError("");
    setSubmitState({ status: "idle", message: "" });
  };

  const handleCoverLetterChange = (event) => {
    const [uploadedFile] = event.target.files || [];
    setCoverLetterFile(uploadedFile || null);
    setFormError("");
    setSubmitState({ status: "idle", message: "" });
  };

  const validateForm = () => {
    if (normalizedPositions.length === 0) {
      setFormError(
        "There are no available positions to apply for right now. Please check back later.",
      );
      return false;
    }

    if (
      !formData.name.trim() ||
      !formData.contactNumber.trim() ||
      !formData.email.trim() ||
      !cvFile ||
      selectedPositions.length === 0
    ) {
      setFormError(
        "Please complete every required field, upload your CV, and choose at least one position.",
      );
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email.trim())) {
      setFormError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData(getDefaultFormData());
    setSelectedPositions([]);
    setCvFile(null);
    setCoverLetterFile(null);
    if (cvInputRef.current) {
      cvInputRef.current.value = "";
    }
    if (coverLetterInputRef.current) {
      coverLetterInputRef.current.value = "";
    }
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ status: "idle", message: "" });

    if (!validateForm()) {
      return;
    }

    setSubmitState({ status: "submitting", message: "" });

    try {
      const encodedCv = await fileToBase64(cvFile, "uploaded CV");
      const encodedCoverLetter = coverLetterFile
        ? await fileToBase64(coverLetterFile, "uploaded cover letter")
        : null;
      const selectedJobDetails = normalizedPositions
        .filter((position) => selectedPositions.includes(position.optionKey))
        .map((position) => ({
          ...(typeof position.raw === "object" ? position.raw : {}),
          title: position.title,
          description: position.description,
        }));

      const response = await submitCareerApplication({
        name: formData.name.trim(),
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim(),
        positions: selectedJobDetails,
        cv: {
          fileName: cvFile.name,
          fileType: cvFile.type || "application/octet-stream",
          fileSize: cvFile.size,
          contentBase64: encodedCv,
        },
        ...(coverLetterFile
          ? {
              coverLetter: {
                fileName: coverLetterFile.name,
                fileType: coverLetterFile.type || "application/octet-stream",
                fileSize: coverLetterFile.size,
                contentBase64: encodedCoverLetter,
              },
            }
          : {}),
        ...(formData.messageToHiringTeam?.trim()
          ? {
              messageToHiringTeam: formData.messageToHiringTeam.trim(),
            }
          : {}),
      });

      if (response?.success === false || response?.error) {
        throw new Error(response?.message || "Unable to submit application.");
      }

      resetForm();
      setSubmitState({
        status: "success",
        message:
          "Your application has been receieved and we'll get back to you if you have been shortlisted for the position.",
      });
    } catch (error) {
      console.error("Error submitting career application:", error);
      setSubmitState({
        status: "error",
        message:
          "Sorry there was an error please try again later or apply to the job via email support@yuranka.com and we'll get back to you.",
      });
    }
  };

  const getAvailablePositions = async () => {
    const response = await makeRequestCall(
      "jobs_and_cvs_script",
      "getAvailablePositions",
    );
    return parsePositionsPayload(response);
  };

  const submitCareerApplication = async (applicationDetails) => {
    return makeRegistrationRequestCall(
      "jobs_and_cvs_script",
      "submitCareerApplication",
      applicationDetails,
    );
  };

  const parsePositionsPayload = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.positions)) {
      return response.positions;
    }

    if (Array.isArray(response?.availablePositions)) {
      return response.availablePositions;
    }

    if (typeof response?.result === "string") {
      try {
        const parsedResult = JSON.parse(response.result);

        if (Array.isArray(parsedResult)) {
          return parsedResult;
        }

        if (Array.isArray(parsedResult?.positions)) {
          return parsedResult.positions;
        }

        if (Array.isArray(parsedResult?.availablePositions)) {
          return parsedResult.availablePositions;
        }
      } catch (error) {
        console.error("Error parsing available positions:", error);
      }
    }

    return [];
  };

  return (
    <section className="careers-section">
      <div className="careers-shell">
        <div className="careers-hero">
          <span className="careers-badge">Careers at Yuranka</span>
          <h1>Join the team behind the games, events, and community.</h1>
          <p>
            Explore our open roles, tell us which positions interest you, and
            send through your CV in one application.
          </p>
        </div>

        {isLoadingPositions ? (
          <div className="careers-loading-card">
            <div className="careers-loading-container">
              <div className="careers-spinner"></div>
              <p>Loading available positions...</p>
            </div>
          </div>
        ) : positionsError ? (
          <div className="careers-state-card">
            <h2>We could not load the careers list.</h2>
            <p>{positionsError}</p>
            <Button size="lg" className="careers-submit" onClick={fetchPositions}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="careers-grid">
            <div className="careers-positions-card">
              <div className="careers-section-header">
                <h2>Available Positions</h2>
                <p>
                  Select any number of roles that match your experience,
                  interests and fill out the application form to apply for these
                  roles.
                </p>
              </div>

              {normalizedPositions.length === 0 ? (
                <div className="careers-empty-state">
                  No open positions are listed right now. Please check back
                  later.
                </div>
              ) : (
                <div className="careers-positions-list">
                  {normalizedPositions.map((position) => {
                    const isSelected = selectedPositions.includes(
                      position.optionKey,
                    );

                    return (
                      <label
                        key={position.optionKey}
                        className={`careers-position-card ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <div className="careers-position-top">
                          <Input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handlePositionToggle(position.optionKey)
                            }
                          />
                          <div>
                            <h3>{position.title}</h3>
                            <p>{position.description}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <form className="careers-form-card" onSubmit={handleSubmit}>
              <div className="careers-section-header">
                <h2>Application Form</h2>
                <p>
                  Required fields are marked below. Cover letter and message are
                  optional.
                </p>
              </div>

              <div className="careers-form-grid">
                <label className="careers-field">
                  <span>Full Name</span>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="careers-field">
                  <span>Contact Number</span>
                  <Input
                    type="tel"
                    name="contactNumber"
                    placeholder="Enter your contact number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="careers-field careers-field-full">
                  <span>Email Address</span>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="careers-field careers-field-full">
                  <span>Message to the Hiring Team</span>
                  <Textarea
                    name="messageToHiringTeam"
                    placeholder="Share anything you want the hiring team to know"
                    value={formData.messageToHiringTeam || ""}
                    onChange={handleInputChange}
                    rows="5"
                  />
                  <small>This field is optional.</small>
                </label>

                <label className="careers-field careers-field-full">
                  <span>CV</span>
                  <Input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvChange}
                    required
                  />
                  <small>Upload your CV as a PDF, DOC, or DOCX file.</small>
                  {cvFile && (
                    <div className="careers-file-pill">
                      Selected: {cvFile.name}
                    </div>
                  )}
                </label>

                <label className="careers-field careers-field-full">
                  <span>Cover Letter</span>
                  <Input
                    ref={coverLetterInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCoverLetterChange}
                  />
                  <small>
                    This upload is optional and uses the same file types as the
                    CV.
                  </small>
                  {coverLetterFile && (
                    <div className="careers-file-pill">
                      Selected: {coverLetterFile.name}
                    </div>
                  )}
                </label>
              </div>

              {formError && (
                <div className="careers-feedback careers-feedback-error">
                  {formError}
                </div>
              )}

              {submitState.message && (
                <div
                  className={`careers-feedback ${
                    submitState.status === "success"
                      ? "careers-feedback-success"
                      : "careers-feedback-error"
                  }`}
                >
                  {submitState.message}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="careers-submit"
                disabled={submitState.status === "submitting"}
              >
                {submitState.status === "submitting"
                  ? "Submitting..."
                  : "Apply"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default Careers;
