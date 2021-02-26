import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table, Container } from 'reactstrap';
import Pagination from './components/Pagination';
import Header from "./components/Header"
import Footer from "./components/Footer"


import {
  fetchApiList,
  onChangePageId,
  onUpdateDataList
} from './store/dispatchers';
import bin from "./assets/remove.png";
import edit from "./assets/edit.png";
import submit from "./assets/icon-tick.svg";

import './App.scss';

function App({
  limit,
  pageId,
  dataList,
  fetchApiList,
  onChangePageId,
  onUpdateDataList
}) {
  const [selectedId, setSelectedId] = useState(null);
  const totalPage = Math.ceil(5000 / limit);
  const _pageId = pageId === 1 ? 0 : ((pageId - 1) * limit);

  useEffect(() => {
    fetch(`http://jsonplaceholder.typicode.com/photos?_start=${_pageId}&_limit=${limit}`)
      .then(response => response.json())
      .then(data => fetchApiList(data))
  }, [_pageId]);

  const onDelete = (id) => {
    const updatedList = dataList.filter((value) =>
      parseInt(value.id) !== parseInt(id)
    )
    onUpdateDataList(updatedList);
  }

  const onEdit = (id) => {
    const updateEditStatus = dataList.map((value) => {
      if (parseInt(value.id) === parseInt(id)) {
        value.editable = true
      }
      return value;
    });
    setSelectedId(id);
    onUpdateDataList(updateEditStatus);
  }
  const onEditTitle = (e) => {
    const updateTitleValue = dataList.map((value) => {
      if (parseInt(value.id) === parseInt(selectedId)) {
        value.title = e.target.value
      }
      return value;
    });
    onUpdateDataList(updateTitleValue)
  }
  const onSubmit = (id) => {
    const updateTitleValue = dataList.map((value) => {
      if (parseInt(value.id) === parseInt(id)) {
        value.editable = false
        console.log(value)
      }
      return value;
    });
    onUpdateDataList(updateTitleValue)
  }

  return (
    <div className="App">
      <Header />
      <Container>
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>Title</th>
              <th>Url</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              dataList && dataList.map((value, index) => {
                return (
                  <tr key={index}>
                    <th>{value.id}</th>
                    <th>
                      <img src={value.thumbnailUrl} alt="image" />
                    </th>
                    <th>
                      {
                        value.editable
                          ? <textarea
                            className="title-textarea"
                            defaultValue={value.title}
                            onChange={(e) => onEditTitle(e)} />
                          : value.title
                      }
                    </th>
                    <th className="url">
                      <a href={value.url} target="_blank"> {value.url} </a>
                    </th>
                    <th className="action-buttons">
                      {
                        value.editable
                          ? <div onClick={(e) => onSubmit(value.id)}>
                            <img src={submit} alt="submit" className="action-buttons__image" />
                          </div>
                          : <div onClick={(e) => onEdit(value.id)}>
                            <img src={edit} alt="edit" className="action-buttons__image" />
                          </div>
                      }
                      <div className=" delete-icon" onClick={(e) => onDelete(value.id)}>
                        <img src={bin} alt="remove" className="action-buttons__image" />
                      </div>
                    </th>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </Container>

      <Pagination
        pageId={pageId}
        total={totalPage}
        _onPaginate={onChangePageId}
      />
      <Footer />
    </div>
  );
}


const mapStateToProps = ({ app }) => {
  return {
    limit: app.limit,
    pageId: app.pageId,
    dataList: app.dataList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchApiList(data) {
      dispatch(fetchApiList(data));
    },
    onChangePageId(data) {
      dispatch(onChangePageId(data))
    },
    onUpdateDataList(data) {
      dispatch(onUpdateDataList(data))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
