var reporters = require('jasmine-reporters');
var jUReporter = new reporters.JUnitXmlReporter({
    savePath: __dirname,
    consolidateAll: false
});
jasmine.getEnv().addReporter(jUReporter)


describe('Validate Authorization' () => {
  it('login',(done) => {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    const req = {
      method:'POST',
      body: JSON.stringify({
        username: 'ffeffe',
        password: 'feffeafeff'
      }),
      credentials:'include',
      headers: header
    };
    fetch(('http://localhost:3000/login')，req).then(res => res.json()).then(res => {
      expect(res.username).toBe('ffeffe');
      expect(res.result).toBe('success');
      done();
    });
  });

  it('logout',(done) => {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    const req = {
      method:'POST',
      body: JSON.stringify({
        username: 'ffeffe',
        password: 'feffeafeff'
      }),
      credentials:'include',
      headers: header
    };
    fetch(('http://localhost:3000/login')，req).then(res => res.json()).then(res => {
      const cookie = res.headers.get('set-cookie');
      fetch('http://localhost:3000/logout'),{
        method:'PUT'
        headers:{
          'Content-Type', 'application/json',
          Cookie:cookie
        }
      }).then(res => res.json()).then(res => {
        expect(res.username).toBe('ffeffe');
        expect(res.result).toBe('success');
        done();
      });
    });
  });

  it('getHeadline',(done) => {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    const req = {
      method:'POST',
      body: JSON.stringify({
        username: 'ffeffe',
        password: 'feffeafeff'
      }),
      credentials:'include',
      headers: header
    };
    fetch(('http://localhost:3000/login')，req).then(res => res.json()).then(res => {
      const cookie = res.headers.get('set-cookie');
      fetch('http://localhost:3000/headline'),{
        method:'GET'
        headers:{
          'Content-Type', 'application/json',
          Cookie:cookie
        }
      }).then(res => res.json()).then(res => {
        expect(res.username).toBe('ffeffe');
        expect(res.headline).toBe('f');
        done();
      });
    });
  });

  it('putHeadline',(done) => {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    const req = {
      method:'POST',
      body: JSON.stringify({
        username: 'ffeffe',
        password: 'feffeafeff'
      }),
      credentials:'include',
      headers: header
    };
    fetch(('http://localhost:3000/login')，req).then(res => res.json()).then(res => {
      const cookie = res.headers.get('set-cookie');
      fetch('http://localhost:3000/headline'),{
        method:'PUT'
        headers:{
          'Content-Type', 'application/json',
          Cookie:cookie
        }
      }).then(res => res.json()).then(res => {
        expect(res.username).toBe('ffeffe');
        expect(res.headline).toBe('ff');
        done();
      });
    });
  });

  it('getArticles',(done) => {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    const req = {
      method:'POST',
      body: JSON.stringify({
        username: 'ffeffe',
        password: 'feffeafeff'
      }),
      credentials:'include',
      headers: header
    };
    fetch(('http://localhost:3000/login')，req).then(res => res.json()).then(res => {
      const cookie = res.headers.get('set-cookie');
      fetch('http://localhost:3000/articles'),{
        method:'GET'
        headers:{
          'Content-Type', 'application/json',
          Cookie:cookie
        }
      }).then(res => res.json()).then(res => {
        expect(res.author).toBe('ffeffe');
        expect(res.text).toBe('77005');
        done();
      });
    });
  });

  it('getArticleId',(done) => {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    const req = {
      method:'POST',
      body: JSON.stringify({
        username: 'ffeffe',
        password: 'feffeafeff'
      }),
      credentials:'include',
      headers: header
    };
    fetch(('http://localhost:3000/login')，req).then(res => res.json()).then(res => {
      const cookie = res.headers.get('set-cookie');
      fetch('http://localhost:3000/articles/1'),{
        method:'GET'
        headers:{
          'Content-Type', 'application/json',
          Cookie:cookie
        }
      }).then(res => res.json()).then(res => {
        expect(res.author).toBe('ffeffe');
        expect(res.text).toBe('610000');
        done();
      });
    });
  });

  it('postArticles',(done) => {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    const req = {
      method:'POST',
      body: JSON.stringify({
        username: 'ffeffe',
        password: 'feffeafeff'
      }),
      credentials:'include',
      headers: header
    };
    fetch(('http://localhost:3000/login')，req).then(res => res.json()).then(res => {
      const cookie = res.headers.get('set-cookie');
      fetch('http://localhost:3000/article'),{
        method:'POST'
        headers:{
          'Content-Type', 'application/json',
          Cookie:cookie
        }
      }).then(res => res.json()).then(res => {
        expect(res.author).toBe('ffeffe');
        expect(res.text).toBe('610000');
        done();
      });
    });
  });

});
