import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import httpService from "../services/httpService";
import config from "../config.json";

class SearchForm extends Form {
  state = {
    data: { query: "" },
    errors: {},
    books: []
  };

  schema = {
    query: Joi.string()
      .required()
      .label("Query")
  };
  //book.volumeInfo.infoLink
  async getBooks(bookSearch) {
    const { data: books } = await httpService.get(config.url + bookSearch);
    this.setState({ books });
    console.log(this.state.books);
  }

  doSubmit = () => {
    const bookSearch = this.state.data.query;
    this.getBooks(bookSearch);
  };
  onSeeMoreClick = book => {
    window.open(
      book.volumeInfo.infoLink,
      "win2",
      "status=no,toolbar=no,scrollbars=yes,titlebar=no,menubar=no,resizable=yes,width=1076,height=768,directories=no,location=no"
    );
  };
  renderTable() {
    if (this.state.books.length === 0) {
      return <p className="container">Results will appear here!</p>;
    } else {
      return (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Book Image</th>
              <th>Book Author</th>
              <th>Book Title</th>
              <th>Book Publisher</th>
            </tr>
          </thead>
          <tbody>
            {this.state.books.items.map(book => (
              <tr key={book.id}>
                <td>
                  <img alt="book" src={book.volumeInfo.imageLinks.thumbnail} />
                </td>
                <td>{book.volumeInfo.authors}</td>
                <td>{book.volumeInfo.title}</td>
                <td>{book.volumeInfo.publisher}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={this.onSeeMoreClick.bind(book, book)}
                  >
                    See More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <form>
            {this.renderInput("query", "Query")}
            {this.renderButton("Search")}
          </form>
        </div>
        {this.renderTable()}
      </React.Fragment>
    );
  }
}

export default SearchForm;
