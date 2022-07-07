import React from 'react';

import { primaryColor } from '../../../theme';

import * as settings from '../../../settings'

class Node extends React.Component {
  state = {
    showChildren: settings && settings.extend_tree
  };

    componentDidUpdate(prevProps, prevState) {
       if(prevProps.selectedProduct !== this.props.selectedProduct) {
          this.props.level === 0 &&
         this.setState({showChildren: true});
         if(this.props.level !== 0) {
           this.props.product === this.props.selectedProduct && this.setState({showChildren: true})
         }
         }
  }
  componentDidMount() {
    this.props.level !== 0 && this.props.product === this.props.selectedProduct && this.setState({showChildren: true})
  }

  handleClick = () => {
    const { product } = this.props;
    !this.state.showChildren &&
    this.props.selectProduct({ product });

    this.setState({ showChildren: !this.state.showChildren });
  };

  hasGrandChildren = () => {
    let { isGroup, product, selectedProduct/*, level */} = this.props;

    // Do this stuff to remove wxpand icon after selection
    if (selectedProduct && product.product && product.product.code === selectedProduct.product.code)
      product = selectedProduct;

    if (isGroup || this.hasChildren(product)) {
      if (!product.children.length) return true;
      for (var i = 0; i < product.children.length; i++) {
        if (product.children[i].isGroup) return true;
      }
    }
    return false;
  };

  hasChildren = p => p && ((p.children && p.children.length) || p.isGroup);

  handleSelect = () => {
    const { selectedProduct, product } = this.props;

    // this we use to extend the tree when the product is selected in the list
    if(!this.state.showChildren)
    {
      this.setState({ showChildren: true });
    }

    if (product.children && product.children.length)
      this.props.selectProduct({ product });

    //else this.props.getSelectedProduct({ sku: product.sku });
    window.scrollTo(0, 680)
  };

  render() {
    const { product, level, selectedProduct, isGroup } = this.props;
    const { showChildren } = this.state;
    const newLevel = level + 1;

    return (
      <div>
        {!level || isGroup ? ( // show the icon if level > 0 or has a group of sub-products
          <div
            className="node"
            style={{
              marginLeft: 10 * level
            }}
          >
            {this.hasGrandChildren() ?
              <img
                className='icon-more colored'
                alt=""
                onClick={this.handleClick}
                src={
                  showChildren && product.children.length
                    ? '/images/icons/tree-icon-min.svg'
                    : '/images/icons/tree-icon-plus.svg'
                }
              />
              : <div className="empty" />
            }

            <div
              className={`node-label ${this.hasGrandChildren() ? 'bold' : 'light'}`}
              onClick={this.handleSelect}
              style={{
                color:
                  selectedProduct && selectedProduct === product
                    ? primaryColor.buttonColor
                    : 'black'
              }}
            >
              {product.product ? product.product.name : ''}
            </div>
          </div>
        ) : null}
        {showChildren && product.children //open the tree when showChildren is true
          && product.children.map((k, i) => (
            <Node
              key={i}
              product={k}
              isGroup={k.isGroup}
              selectedProduct={selectedProduct}
              selectProduct={this.props.selectProduct}
              /*getProductToTree={this.props.getProductToTree}
              getSelectedProduct={this.props.getSelectedProduct}*/
              level={newLevel}
            />
          ))
        }
      </div>
    );
  }
}

// because WithStyle return func
// mapStateToProps doesnt work recursive
export default Node;
