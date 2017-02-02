/**
 *
 */
class ManagerPage extends React.Component {
  constructor() {
    super();
    this.state = {paper: []};
  }
  componentDidMount() {
    $.ajax({
      url : 'http://localhost:3900/api/all',
      type : 'get',
      dataType : 'json',
      success : function (data) {
        this.setState({paper: eval(data.result)});
      }.bind(this)
    });
  }
  render() {
    return (
      <div className="row">
        <SideBar />
        <AddNewPaper />
        {/*<PaperList paper={this.state.paper}/>*/}
      </div>
    );
  }
}

/* add new papers page */
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



/* paper list page */
class PaperList extends React.Component {
  render() {
    var Node = this.props.paper.map( function(each) {
      return (
        <tr>
          <td>{each.id}</td>
          <td>{each.author}</td>
          <td>{each.title}</td>
          <td>{each.booktitle}</td>
        </tr>
      );
    });
    return (
      <div className="col-md-10">
        <table>
          <tr><td>id</td><td>author</td><td>title</td><td>booktitle</td></tr>
          {Node}
        </table>
      </div>
    );
  }
}

ReactDOM.render(
  <ManagerPage />,
  document.getElementById('root')
);