export const enum BookmarksAction {
  ADD = "ADD",
  DELETE = "DELETE",
  INVALID = "INVALID",
}

type props = {
  web_link: string;
  primary: string;
  secondary: string;
  id: number;
  isVisible: boolean;
};

export default function bookmarkAction(action: BookmarksAction, props: props) {
  switch (action) {
    case BookmarksAction.ADD:
      addArticle(props);
      break;
    case BookmarksAction.DELETE:
      removeArticle(props);
      break;
  }
}

function addArticle(props: props) {
  let articleSavedObject = JSON.parse(
    localStorage.getItem("articles") || "null"
  );

  // Add article
  let articleDetails = {
    id: props.id,
    web_link: props.web_link,
    primary: props.primary,
    secondary: props.secondary,
  };
  // Check if the Object is null and decalre {}
  if (
    articleSavedObject === null ||
    Object.keys(articleSavedObject).length === 0
  ) {
    let articleInitialObject: any = {};
    articleSavedObject = articleInitialObject;
  }
  articleSavedObject[props.id.toString()] = articleDetails;
  localStorage.setItem("articles", JSON.stringify(articleSavedObject));
}

function removeArticle(props: props) {
  let articleSavedObject = JSON.parse(
    localStorage.getItem("articles") || "null"
  );

  // Remove the saved article
  delete articleSavedObject[props.id];
  localStorage.setItem("articles", JSON.stringify(articleSavedObject));
}
