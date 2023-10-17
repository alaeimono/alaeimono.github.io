import React , { Component} from 'react';
import blue_car from '../static/svg/blue-car.svg';
import gray_car from '../static/svg/gray-car.svg';

class CarImage extends Component{
    constructor(){
        super();
        this.state = {
            img: gray_car,
            enabled:false,
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.enabled !== this.props.enabled){
            if (this.props.enabled){
                this.setState({enabled:true, img:blue_car});
            }else{
                this.setState({enabled:false, img:gray_car})
            }
        }
    }

    render (){
        return(
            <div className="d-flex flex-column justify-content-center align-items-center">
            <img src={this.state.img} alt={""} height={450} width={450} />
          </div>
        );
    }
}

export default CarImage;