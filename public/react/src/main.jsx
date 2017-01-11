var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList list={this.state.data} />
                <CommentForm />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.list.map(function(comment) {
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                {this.props.children}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function() {
        return (
            <div className="commentForm">
                Hello, world! I am a CommentForm.
            </div>
        );
    }
});

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
            <div>
                <h1>Dashboard</h1>
                <PaperList paper={this.state.paper}/>
            </div>
        );
    }
}

/* Paper List */
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
            <div>
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
    document.getElementById('content')
);