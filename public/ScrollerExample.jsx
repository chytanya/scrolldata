import React, { Component, PureComponent } from 'react';
import example from './exampleDataset.json';
import Scroller from '../src/Scroller';
import style from './App.stylm';
import Slider from './Slider';


const Render = ({ rowIndex, rowHeight, data: { requestId, contentPartnerId, fulfillmentPartner, movieId }, }) => {

    return <div className={style.row} style={{ height: rowHeight }}>
        <div className={`${style.cell} ${style.index}`}>{rowIndex}</div>
        <div className={style.cell}>{requestId}</div>
        <div className={style.cell}>{contentPartnerId}</div>
        <div className={style.cell}>{fulfillmentPartner}</div>
        <div className={style.cell}>{movieId}</div>
    </div>
};

const Blank = ({ rowHeight }) => {
    return <div className={style.row} style={{ height: rowHeight }}>
        <div className={`${style.blank} ${style.index}`}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
    </div>
};

const wait = (timeout, value) => new Promise(
    r => setTimeout(r, timeout * 1000, value));

export default class ScrollerExample extends Component {
    state = {
        scrollTo  : 0,
        rowHeight : 50,
        height    : 600,
        width     : 900,
        rowCount  : example.length,
        renderItem: Render,
        fakeFetch : 0,
        bufferSize: 0
    };

    handleNumChange = ({ target: { value, name } }) =>
        this.setState({ [name]: parseInt(value, 10) });

    rowData = (rowIndex, count = 1) => {
        console.log(`rowData`, rowIndex, count);
        const { fakeFetch } = this.state;

        const data = example.slice(rowIndex, rowIndex + count);
        return wait(fakeFetch, data);

    };

    handleScrollTo   = (scrollTo) => {
        this.setState({ scrollTo });
    };
    handleRenderItem = ({ target: { checked, name } }) => {
        this.setState({ [name]: checked ? Render : Blank });
    };

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, ...props } = this.state;
        return <form className='inline-form'>
            <Slider name='scrollTo' label='Scroll To' value={this.state}
                    max={this.state.rowCount}
                    onChange={this.handleNumChange}/>
            <Slider name='rowHeight' label='Row Height' value={this.state}
                    max={600}
                    onChange={this.handleNumChange}/>
            <Slider name='rowCount' label='Row Count' value={this.state}
                    max={example.length}
                    onChange={this.handleNumChange}/>
            <Slider name='height' label='Height' value={this.state}
                    max={1600}
                    onChange={this.handleNumChange}/>
            <Slider name='width' label='Width' value={this.state}
                    max={1600}
                    onChange={this.handleNumChange}/>
            <Slider name='bufferSize' label='Buffer size' value={this.state}
                    max={example.length}
                    onChange={this.handleNumChange}/>
            <Slider name='fakeFetch'
                    label='Time to delay fetch (s)'
                    value={this.state}
                    min={0}
                    max={10}
                    onChange={this.handleNumChange}
            />


            <h1>Virtualized Scroller</h1>
            <Scroller className={style.container} renderItem={Render}
                      renderBlank={Blank}
                      rowData={this.rowData}
                      onScrollToChanged={this.handleScrollTo}
                      {...props}/>
        </form>
    }
}
