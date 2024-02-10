import React from "react";
import { Link } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection,query,orderBy,where } from "firebase/firestore";
import { db } from "../../firebase/config";
import ReactLoading from "react-loading";
import Moment from "react-moment";

const AllTasksSection = ({ user , querybutton}) => {
  const [value, loading, error] = useCollection(query(collection(db, user.uid),querybutton));
 
  if (error) {
    return <h1>ERROR</h1>;
  }

  if (loading) {
    return (
      <section className="mttt">
        <ReactLoading type={"spin"} color={"white"} height={77} width={77} />
      </section>
    );
  }

  if (value) {
    

    return (
      <section className="flex all-tasks mt">
        {value.docs.length===0 && [
          <h1>Congratulations you finsihed your tasks </h1>
        ]}
        {value.docs.map((item) => {
        
       
        
          return (
            <article key={item.data().id} dir="auto" className="one-task">
              <Link to={`/edit-task/${item.data().id}`} style={{height:"100%"}}>
                <h2  > {item.data().completed? `${item.data().title} {Completed}` : item.data().title} </h2>
                <ul>
                  {item.data().details.map((item, index) => {
                    if (index < 2) {
                      return <li key={item}> {item} </li>;
                    } else {
                      return false;
                    }
                  })}
                </ul>

                <p className="time">
                  <Moment fromNow date={item.data().id} />
                </p>
              </Link>
            </article>
          );
        
        
        })}
      </section>
    );
  }
};

export default AllTasksSection;
