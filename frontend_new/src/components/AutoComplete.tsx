import { useFetch } from "./Get";

const AutoCompleteSearch = (sinput: string) => {
  const [res, resStatus] = useFetch(
    "https://anu.jkl.io/api/".concat("suggest").concat("?input=").concat(sinput)
  );
  return res;
};
export { AutoCompleteSearch };
