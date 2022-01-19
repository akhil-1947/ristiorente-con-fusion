import React from 'react';

function Loading () {
    return(
        <div className="container">
            <div className="col-12 self-align-center">
                <span className="fa fa-spinner fa-pulse fa-fw fa-3x text-primary"></span>
                <p> Loading .....</p>
            </div>
        </div>
    );
}

export default Loading;