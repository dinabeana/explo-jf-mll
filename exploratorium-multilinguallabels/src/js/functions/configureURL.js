
const configureURL = (urlPrefix, exhibitId, languageAbbr) => {
  const url = `${urlPrefix}${exhibitId}#${languageAbbr}`;
  return url;
};

export default configureURL;
