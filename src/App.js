import './App.css';
import React, { Component } from 'react';
import {Observable} from "rxjs";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            seconds : 0,
            min : 0,
            hours : 0,
            countClick : 0,
            timer : null,
            disabled: true,
            countDouble: 0,
            lastClick: null,
        }
    }
    startTimer(type) {
        const thiis = this;
        this.setState({countClick: this.state.countClick += 1})

        if(type === 'wait' || (this.state.seconds === 0 && this.state.min === 0 && this.state.hours === 0))
        {
            this.setState({disabled: true})
        }
        const stream$ = new Observable( obserever =>{
            if(type === 'reset'){
                obserever.complete();
                if(!this.state.disabled){
                    this.setState({countClick: this.state.countClick -= 1})
                }
            }
            if(this.state.countClick % 2 !== 0) {
                this.setState({disabled: false})
                this.setState({timer:
                        setInterval(() => {
                            obserever.next(thiis.setState({seconds: thiis.state.seconds += 1}))
                            if(this.state.seconds === 60) {
                                thiis.setState({min: thiis.state.min += 1})
                                thiis.setState({seconds: 0})
                            }
                            if(this.state.min === 60) {
                                thiis.setState({hours: thiis.state.hours += 1})
                                thiis.setState({min: 0})
                            }

                        }, 1000)
                })
            }
            else {
                obserever.complete()
                this.setState({disabled: true})
            }
        })
        stream$.subscribe( {
            complete(){
                if(type === 'wait'){
                    clearInterval(thiis.state.timer);
                } else {
                    clearInterval(thiis.state.timer);
                    thiis.setState({seconds: 0, min: 0, hours: 0})
                }
            }
        })
    }

    countDoubleClick(){
        this.setState({countDouble: this.state.countDouble += 1})
        if(this.state.lastClick === null) {
            this.setState({lastClick: new Date().getTime()});
        }
        if(this.state.lastClick !== null) {
            let secClick = new Date().getTime();
            let curr = Math.abs(secClick - this.state.lastClick);
            if(curr <= 300) {
                this.startTimer.call(this, 'wait');
                this.setState({lastClick: null})
            }
            this.setState({lastClick: secClick})
        }
    }

    render() {
        return (
            <div className="timer">
                <div className="wrapper">
                    <h2>Timer</h2>
                    <div className="time">
                        <span>
                            { this.state.hours < 10 ? '0' : '' }{this.state.hours}:
                        </span>
                        <span>
                            { this.state.min < 10 ? '0' : '' }{this.state.min}:

                        </span>
                        <span>
                            { this.state.seconds < 10 ? '0' : '' }{this.state.seconds}

                        </span>
                    </div>
                    <div className="buttons">
                        <button onClick={this.startTimer.bind(this, 'start')}>Start / stop</button>
                        <button onClick={this.countDoubleClick.bind(this)} disabled={this.state.disabled} >Wait</button>
                        <button onClick={this.startTimer.bind(this, 'reset')} disabled={this.state.seconds === 0 && this.state.min === 0 && this.state.hours === 0}>Reset</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
