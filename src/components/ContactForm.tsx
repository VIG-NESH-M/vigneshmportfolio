import React, { useState } from "react";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  Loader,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { submitContactMessage } from "../lib/supabase";

interface ContactFormProps {
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear status when user starts typing
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus("error");
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const success = await submitContactMessage(
        formData.name.trim(),
        formData.email.trim(),
        formData.subject.trim() || undefined,
        formData.message.trim()
      );

      if (success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-form-container ${className}`}>
      {/* Success Message */}
      {submitStatus === "success" && (
        <div className="contact-alert contact-alert--success">
          <div className="contact-alert__icon">
            <CheckCircle size={20} />
          </div>
          <div>
            <h4 className="contact-alert__title">Message Sent!</h4>
            <p className="contact-alert__message">
              Thanks for reaching out! I'll get back to you soon.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === "error" && (
        <div className="contact-alert contact-alert--error">
          <div className="contact-alert__icon">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="contact-alert__title">Error</h4>
            <p className="contact-alert__message">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="contact-form__row">
          <div className="contact-form__field">
            <label htmlFor="name" className="contact-form__label">
              <User size={16} />
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="contact-form__input"
              placeholder="Your full name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="contact-form__field">
            <label htmlFor="email" className="contact-form__label">
              <Mail size={16} />
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="contact-form__input"
              placeholder="your.email@example.com"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="contact-form__field">
          <label htmlFor="subject" className="contact-form__label">
            <MessageSquare size={16} />
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="contact-form__input"
            placeholder="What would you like to discuss?"
            disabled={isSubmitting}
          />
        </div>

        <div className="contact-form__field">
          <label htmlFor="message" className="contact-form__label">
            <MessageSquare size={16} />
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="contact-form__textarea"
            placeholder="Tell me about your project, ideas, or just say hello..."
            rows={6}
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="contact-form__submit"
          disabled={
            isSubmitting ||
            !formData.name ||
            !formData.email ||
            !formData.message
          }
        >
          {isSubmitting ? (
            <>
              <Loader
                size={16}
                className="contact-form__submit-icon contact-form__submit-icon--spin"
              />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} className="contact-form__submit-icon" />
              Send Message
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 text-center">
          * Required fields. Your information will be handled securely.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
