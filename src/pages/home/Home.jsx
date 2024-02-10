import Header from "../../comp/header";
import Footer from "../../comp/Footer";
import Loading from "../../comp/Loading";
import Erroe404 from "../erroe404";
import { Helmet } from "react-helmet-async";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/config";
import { Link } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
// Level 3
import "./Home.css";
import { useState } from "react";
import { doc, orderBy, setDoc, where } from "firebase/firestore";
import HomeModal from "./modal";
import AllTasksSection from "./AllTasksSection";

const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const sendAgain = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email verification sent!");
      // ...
    });
  };

  // ===============================
  //    FUNCTIONS of Modal
  // ===============================
  const [showModal, setshowModal] = useState(false);
  const [showLoading, setshowLoading] = useState(false);
  const [showMessage, setshowMessage] = useState(false);
  const [taskTitle, settitle] = useState("");
  const [array, setarray] = useState([]);
  const [subTask, setsubTask] = useState("");
  const [querybutton, setquerybutton] = useState(orderBy("id", "asc"));
  const [value,setvalue] = useState(null)
  const [active, setactive] = useState(true);
  const closeModal = () => {
    setshowModal(false);
    settitle("");
    setarray([]);
  };
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    // Depending on the selected value, you can perform the desired actions
    if (selectedValue === "completed") {
      setquerybutton(where("completed", "==", true));
    } else if (selectedValue === "notCompleted") {
      // Perform other actions for "Not Completed" option
      setquerybutton(where("completed", "==", false));
    } else {
      // Default action for "All Tasks" or other cases
      setquerybutton(orderBy("id", "desc"));
      setactive(true);
    }
  };
  const titleInput = (eo) => {
    settitle(eo.target.value);
  };

  const detailsInput = (eo) => {
    setsubTask(eo.target.value);
  };

  const addBTN = (eo) => {
    eo.preventDefault();

    if (!array.includes(subTask)) {
      array.push(subTask);
    }

    console.log(array);
    setsubTask("");
  };

  const submitBTN = async (eo) => {
    eo.preventDefault();
    setshowLoading(true);
    const taskId = new Date().getTime();
    await setDoc(doc(db, user.uid, `${taskId}`), {
      title: taskTitle,
      details: array,
      id: taskId,
      completed: false,
    });
    setshowLoading(false);
    settitle("");
    setarray([]);

    setshowModal(false);
    setshowMessage(true);

    setTimeout(() => {
      setshowMessage(false);
    }, 4000);
  };

  if (error) {
    return <h1>Error : {error.message}</h1>;
  }

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>HOME Page</title>
          <style type="text/css">{`.Light main h1 span{color: #222}   `}</style>
        </Helmet>

        <Header />

        <main>
          
          <p className="pls">
            Please{" "}
            <Link style={{ fontSize: "30px" }} to="/signin">
              sign in
            </Link>{" "}
            to continue...{" "}
            <span>
              <i className="fa-solid fa-heart"></i>
            </span>
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (user) {
    if (!user.emailVerified) {
      return (
        <>
          <Helmet>
            <title>HOME Page</title>
            <meta name="description" content="HOMEEEEEEEEEEEE" />
          </Helmet>

          <Header />

          <main>
            <p>
              {" "}
              Welcome: {user.displayName}{" "}
              <span>
                <i className="fa-solid fa-heart"></i>{" "}
              </span>
            </p>

            <p>Please verify your email to continue ✋ </p>
            <button
              onClick={() => {
                sendAgain();
              }}
              className="delete"
            >
              Send email
            </button>
          </main>

          <Footer />
        </>
      );
    }

    if (user.emailVerified) {
      return (
        <>
          <Helmet>
            <title>HOME Page</title>
          </Helmet>

          <Header />

          <main className="home">
            {/* OPIONS (filtered data) */}
            <section className="parent-of-btns flex mtt">
              <button
                style={{ opacity: active ? 1 : 0.3 }}
                onClick={() => {
                  setquerybutton(orderBy("id", "desc"));
                  setactive(false);
                  setvalue("all");
                  setTimeout(() => {
                    setvalue(null)
                  }, 1000);
                }}
              >
                Newest first
              </button>

              <button
                style={{ opacity: active ? 0.3 : 1 }}
                onClick={() => {
                  setquerybutton(orderBy("id", "asc"));
                  setactive(true);
                  setvalue("all");
                  setTimeout(() => {
                    setvalue(null)
                  }, 1000);
                }}
              >
                Oldest first
              </button>
              <select id="browsers" onChange={(e) => handleSelectChange(e)} value={value}>
                <option value="all"> All Tasks </option>
                <option value="completed"onClick={()=>{setvalue("completed")}}> Completed </option>
                <option value="notCompleted" onClick={() => setvalue("notCompleted")}> Not Completed </option>
              </select>
            </section>

            {/* SHOW all tasks */}
            <AllTasksSection user={user} querybutton={querybutton} />

            {/* Add new task BTN */}
            <section className="mt">
              <button
                onClick={() => {
                  setshowModal(true);
                }}
                className="add-task-btn"
              >
                Add new task <i className="fa-solid fa-plus"></i>
              </button>
            </section>

            {showModal && (
              <HomeModal
                closeModal={closeModal}
                titleInput={titleInput}
                detailsInput={detailsInput}
                addBTN={addBTN}
                submitBTN={submitBTN}
                taskTitle={taskTitle}
                subTask={subTask}
                array={array}
                showLoading={showLoading}
              />
            )}

            <p
              style={{
                right: showMessage ? "20px" : "-100vw",
              }}
              className="show-message"
            >
              Task added successfully{" "}
              <i className="fa-regular fa-circle-check"></i>
            </p>
          </main>

          <Footer />
        </>
      );
    }
  }
};

export default Home;
