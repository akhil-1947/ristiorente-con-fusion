import React from 'react';
import {Card,CardImg, CardBody, CardText, CardTitle, CardSubtitle} from 'reactstrap';
import Loading from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform } from 'react-animation-components';

function RenderCard({item,isLoading,errMess}) {
    if(isLoading) {
        return (
            <Loading />
        );
    }
    else if (errMess) {
        return (
            <div>
                <h4>{errMess}</h4>
            </div>
        );
    }
    else if (item) {
        return(
            <FadeTransform in 
                transformProps = {{
                    exitTransform : 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg src={baseUrl + item.image} alt={item.name} />
                    <CardBody>
                        <CardTitle>{item.name}</CardTitle>
                        {item.designation != null ? <CardSubtitle>{item.designation}</CardSubtitle> : null }
                        <CardText>{item.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        );
    }
    else {
        return(<div></div>);
    }
}


function Home(props) {
    return (
        <div className="container">
            <div className="row row-content">
                <div className="col-12 col-md m-1">
                    <RenderCard item={props.dish} isLoading={props.dishesLoading} errMess={props.dishesErrMess} />
                </div>
                <div className="col-12 col-md m-1">
                    <RenderCard item={props.promotion} isLoading={props.promoLoading} errMess={props.promoErrMess}/>
                </div>
                <div className="col-12 col-md m-1">
                    <RenderCard item={props.leader} isLoading={props.leaderLoading} errMess={props.leaderErrMess}/>
                </div>
            </div>
        </div>
    );
}

export default Home;