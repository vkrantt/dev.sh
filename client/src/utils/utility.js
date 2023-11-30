export const formatDate = (inputDate) => {
  const options = { month: "short", day: "numeric" };
  const dateObject = new Date(inputDate);
  return dateObject.toLocaleDateString("en-US", options);
};

export const capitalizeName = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 330) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

export const removeHtmlTagsAndMedia = (inputString) => {
  var stringWithoutHtml = inputString.replace(/<\/?[^>]+(>|$)/g, "");
  stringWithoutHtml = stringWithoutHtml.replace(/<img\b[^>]*>/g, "");
  stringWithoutHtml = stringWithoutHtml.replace(
    /<video\b[^>]*>.*?<\/video>/g,
    ""
  );
  return stringWithoutHtml;
};
