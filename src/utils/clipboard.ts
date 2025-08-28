/**
 * Modern clipboard utility with fallback support
 * Uses the modern Clipboard API when available, falls back to execCommand
 */

export const copyToClipboard = async (text: string): Promise<boolean> => {
  // Check if the modern Clipboard API is available
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn(
        "Modern clipboard API failed, falling back to execCommand:",
        err
      );
      return fallbackCopyToClipboard(text);
    }
  }

  // Fallback to the old method
  return fallbackCopyToClipboard(text);
};

const fallbackCopyToClipboard = (text: string): boolean => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  textArea.setAttribute("readonly", "");
  textArea.setAttribute("aria-hidden", "true");

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const result = document.execCommand("copy");
    document.body.removeChild(textArea);
    return result;
  } catch (err) {
    console.error("Failed to copy text:", err);
    document.body.removeChild(textArea);
    return false;
  }
};
