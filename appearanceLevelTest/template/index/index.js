
class Index {
  constructor () {
    
  }

  index(fn) {
    console.log('我是从模板过来的')
    fn && fn();
  }
  
}

export default Index;