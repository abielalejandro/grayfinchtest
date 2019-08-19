import React, {Component} from 'react';
import { Container, Row, Col, Button } from 'reactstrap';

const LIMIT=5;
const API_KEY='DWqOzKWHqkTgfBgVVSISjAXk7LOSXfga';
const API = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=${LIMIT}&q=`;
const DEFAULT_OPTIONS = ['cats','dogs','elephants','lions','monkeys'];

class App extends Component {

  state = {
    data: [],
    selected: [],
    showOptions: true,
    ready: false
  };

  componentDidMount() {
      this.search(DEFAULT_OPTIONS[0]);
  }

  search = (option) => {
    let {selected} = this.state;
    
    if (selected.length===DEFAULT_OPTIONS.length) return;

    fetch(API+option, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
    })
    .then(r=> r.json())
    .then(resp => {
      this.setState({data:resp.data});
    })
    .catch((err) => {
        console.error(err);
    });
  }

  onSelect = (item) => {
    const {selected } = this.state;
    if (selected.length===DEFAULT_OPTIONS.length) return;
    
    selected.push(item);
    const i = (selected.length);
    this.setState(
        {
          selected, 
          showOptions:(selected.length<DEFAULT_OPTIONS.length),
          ready:(selected.length===DEFAULT_OPTIONS.length)
        });
    this.search(DEFAULT_OPTIONS[i]);
  }

  render() {
    const {data, selected,showOptions, ready} = this.state;
    return (

      <Container fluid={true} className="text-center">
          {showOptions?
            <div> 
            <h1>Check your loved animals?</h1>
            <Row>
              {data.map((row,i)=>{
                  return (<Col key={i} sm={6} md={3}><Image onSelect={this.onSelect} image={row} /></Col>)
              })}
            </Row>
            <hr />
            </div>
          :null}
          <h1>Your choices!</h1>
          <Row>
            {selected.map((row,i)=>{
                return (<Col key={i} sm={6} md={3}><Image onSelect={this.onSelect} image={row} /></Col>)
            })}
          </Row>
          {ready?
            <Button color="primary">Ok</Button>
          :null}
      </Container>    
    );
  
  }
}

const Image = (props) => {
    return (<a href={props.image.images.preview_gif.url} onClick={(e)=>{e.preventDefault();props.onSelect(props.image)}} >
        <img src={props.image.images.preview_gif.url} alt={props.image.caption} />
      </a>);
}
export default App;
