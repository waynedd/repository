import React from 'react';
import ReactDOM from 'react-dom';
import SideBar from './component/SideBar';

class IndexPage extends React.Component {
  render() {
    return (
      <div className='row'>
        <SideBar id='1' />
        <AddNewPaper />
      </div>
    );
  }
}

var AddNewPaper = React.createClass({
  render: function() {
    return (
      <div className="col-md-10 col-md-offset-2 main">
        <h2>Haha</h2>
        <p>form</p>
        <div className="form-group">
          <textarea className="form-control" id="exampleTextarea" rows="20"/>
        </div>
        <button type="button" className="btn btn-primary">Submit</button>
      </div>
    )
  }
});

ReactDOM.render(
  <IndexPage />,
  document.getElementById('root')
);