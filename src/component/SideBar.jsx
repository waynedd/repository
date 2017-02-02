import React from 'react';

export default class SideBar extends React.Component {
  render() {
    var c = ['', '', ''];
    c[Number(this.props.id)-1] = 'active';

    return (
      <div className="col-md-2 sidebar">
        <p>{this.props.name}</p>
        <ul className="nav nav-sidebar">
          <li className={c[0]}><a href="#">Add New Paper</a></li>
          <li className={c[1]}><a href="#">Show</a></li>
          <li className={c[2]}><a href="#">Export</a></li>
        </ul>
      </div>
    )
  }
}