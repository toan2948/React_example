import React, {useEffect, useState} from 'react';

import Page from '../page';
import SearchBox from '../../components/common/SearchBox';
import BreadCrumbs from '../../components/common/Breadcrumbs';
import Filter from '../../components/search/filter';
import SearchResult from '../../components/search/searchResult';

import qs from 'qs';
import classNames from 'classnames';

import { getIndividualProduct } from '../../actions/products';
import { connectTo } from '../../utils/generic';
import styles from './style';
import withStyles from '@mui/styles/withStyles';
import { withTranslation } from 'react-i18next';

import { findProducts } from '../../actions/search';
import {useLocation, useNavigate} from "react-router";

function SearchResultPage (props) {
  const [page, setPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [didMount, setDidMount] = useState(false)
  const location = useLocation()
  let navigate = useNavigate()

  useEffect( () => {
    !props.token && navigate('/', { replace: true});
    let params = qs.parse(location.search.replace('?', ''));
    let searchValueLocal = localStorage.getItem('searchValue');

    if (searchValueLocal) {
      if (searchValueLocal !== params.searchValue) {
        localStorage.setItem('searchValue', params.searchValue);
        const newParams = {
          searchValue: params.searchValue,
          page: 1,
        };
        findProducts(newParams);

        setSearchValue(params.searchValue)

      }
      else
        props.findProducts(params);
        params.page !==undefined && setPage( parseInt(params.page) - 1)
      }
      setDidMount(true)
    props.getIndividualProduct();
  }, [])

  useEffect(() => {
    !props.token && navigate('/', { replace: true });
    if (!didMount) return
    let params = qs.parse(location.search.replace('?', ''));
      const newParams = {
        searchValue: params.searchValue,
        page: 1,
      };
      navigate({
        search: '?' + qs.stringify(newParams, {arrayFormat: 'brackets'}),
      }, {replace: true});
      props.findProducts(newParams)

  },[searchValue])


  const clear = () => {
    const params = {
      searchValue: qs.parse(location.search.replace('?', ''))
        .searchValue,
    };
    findProducts(params);
  };

  const handleSorting = (param) => {
    const params = {
      ...qs.parse(location.search.replace('?', '')),
      ...param,
    };
    findProducts(params);
  };

  const handlePageChange = (page) => {
     setPage(page)

    const newParams = {
      ...qs.parse(location.search.replace('?', '')),
      page: page + 1,
    };

    findProducts(newParams);
  };

  const getParams = () => ({
    ...qs.parse(location.search.replace('?', '')),
  });

  const findProducts = (params) => {
    navigate({
      search: '?' + qs.stringify(params, { arrayFormat: 'brackets' }),
    });
    props.findProducts(params);
  };


  const setSearchValueFunction = (value) => {
    setSearchValue(value)
  }
  const handleSetPage = () => {
    setPage(0)
  }
    const { classes, t } = props;
    const requestParams = qs.parse(location.search.replace('?', ''));

    return (
      <Page>
        <div
          className='layout-section home-section'
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${props.backgroundUrl}') no-repeat  0% 0% / 100%`,
          }}
        >
          <BreadCrumbs links={[{ name: t('home'), link: '/home' }]} />
        </div>
        <SearchBox handleSetPage = {handleSetPage}
                   setSearchValueFunction = {setSearchValueFunction}
        />

        <div className='main-content'>
          <div className={classNames('search-content', classes.content)}>
            <Filter
              params={getParams()}
              clear={clear}
              handleTypeChange={(types) =>
                handleSorting({ productType: types, page: 1 })
              }
              handleYourTypeChange={(types) =>
                handleSorting({ individualProduct: types, page: 1 })
              }
              handlePriceSelect={(prices) =>
                handleSorting({ ...prices, page: 1 })
              }
            />
            <SearchResult
              page={page}
              handleChangePage={handlePageChange}
              searchString={requestParams.searchValue}
              changeSorting={(order) =>
                handleSorting({ order: order, page: 1 })
              }
            />
          </div>
        </div>
      </Page>
    );
}

export default connectTo(
  (state) => ({
    token: state.auth.token,
    backgroundUrl: state.staticContent.backgroundUrl,
  }),
  {
    getIndividualProduct,
    findProducts,
  },
  withTranslation('searchPage')(withStyles(styles)(SearchResultPage))
);
