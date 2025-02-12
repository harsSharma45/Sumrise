import {formatISO9075} from "date-fns";
import {Link, useHistory} from "react-router-dom";
import { getPostById } from './api';

export default function Post({_id,title,summary,cover,content,createdAt,author}) {
  const history = useHistory();

  const handleClick = (event) => {
    event.preventDefault();
    history.push(`/author/${author.username}`);
  };

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={'http://localhost:5000/'+cover} alt=""/>
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <button onClick={handleClick} style={{ textDecoration: 'none' }} className="author">{author.username}</button>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}