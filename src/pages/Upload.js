import { Fragment } from "react";
import Project from "../components/Project";
import "./index.css";

function Upload({ API }) {
    return (
        <Fragment>
            <div className="container">
                <Project API={API}/>
            </div>
        </Fragment>
        
    );
}

export default Upload;
