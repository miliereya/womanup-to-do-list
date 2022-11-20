import { useState } from "react";
import { Header } from "./components/Header";
import { TodoList } from "./components/TodoList"
import { SignPopup } from "./components/SignPopup";
import { PageSpinner } from "./components/UI/Spinner";
import { UserAuth } from "./context/AuthContext";

function App() {
  const [authPopupToogle, setAuthPopupToogle] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const { user } = UserAuth()

  return (
    <>
      {isLoading && <PageSpinner />}
      <Header setAuthPopupToogle={setAuthPopupToogle} />
      {authPopupToogle && <SignPopup setAuthPopupToogle={setAuthPopupToogle} />}
      <div className="container">
        {user && <TodoList setLoading={setLoading} />}
      </div>
    </>
  );
}

export default App;
