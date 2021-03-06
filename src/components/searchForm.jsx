import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import httpService from "../services/httpService";
import config from "../config.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const query = this.state.data.query;
    const bookSearch = query.split(" ").join("+");
    this.getBooks(bookSearch);
  };
  onSeeMoreClick = book => {
    window.open(
      book.volumeInfo.infoLink,
      "win2",
      "status=no,toolbar=no,scrollbars=yes,titlebar=no,menubar=no,resizable=yes,width=500,height=300,directories=no,location=no"
    );
  };
  renderTable() {
    if (this.state.books.length === 0) {
      return <p className="container">Results will appear here!</p>;
    } else {
      try {
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
                    <img
                      alt="book"
                      src={book.volumeInfo.imageLinks.thumbnail}
                    />
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
      } catch (ex) {
        toast.error("Unable to find books");
        const books = [];
        this.setState({ books });
      }
    }
  }

  render() {
    return (
      <div className="container">
        <ToastContainer />
        <form>
          {this.renderInput("query", "Query")}
          {this.renderButton("Search")}
        </form>

        {this.renderTable()}
      </div>
    );
  }
}

export default SearchForm;
