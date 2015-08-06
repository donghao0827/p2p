'use strict';

var assert = require('assertthat'),
    eventEmitter2 = require('eventemitter2'),
    nock = require('nock');

var getId = require('../lib/getId'),
    Peer = require('../lib/Peer');

var EventEmitter2 = eventEmitter2.EventEmitter2;

suite('Peer', function () {
  test('is a function.', function (done) {
    assert.that(Peer).is.ofType('function');
    done();
  });

  test('throws an error if options are missing.', function (done) {
    assert.that(function () {
      /* eslint-disable no-new */
      new Peer();
      /* eslint-enable no-new */
    }).is.throwing('Options are missing.');
    done();
  });

  test('throws an error if the host is missing.', function (done) {
    assert.that(function () {
      /* eslint-disable no-new */
      new Peer({
        port: 3000
      });
      /* eslint-enable no-new */
    }).is.throwing('Host is missing.');
    done();
  });

  test('throws an error if the port is missing.', function (done) {
    assert.that(function () {
      /* eslint-disable no-new */
      new Peer({
        host: 'localhost'
      });
      /* eslint-enable no-new */
    }).is.throwing('Port is missing.');
    done();
  });

  test('returns an event emitter.', function (done) {
    var peer = new Peer({
      host: 'localhost',
      port: 3000
    });

    assert.that(peer).is.instanceOf(EventEmitter2);
    done();
  });

  test('optionally sets metadata.', function (done) {
    var peer = new Peer({
      host: 'localhost',
      port: 3000,
      metadata: { foo: 'bar' }
    });

    assert.that(peer.metadata).is.equalTo({ foo: 'bar' });
    done();
  });

  suite('instance', function () {
    var peer;

    setup(function (done) {
      peer = new Peer({
        host: 'localhost',
        port: 3000
      });
      done();
    });

    suite('self', function () {
      test('contains information on the node itself.', function (done) {
        assert.that(peer.self).is.equalTo({
          host: 'localhost',
          port: 3000,
          id: getId('localhost:3000')
        });
        done();
      });
    });

    suite('metadata', function () {
      test('initially is an empty object.', function (done) {
        assert.that(peer.metadata).is.equalTo({});
        done();
      });
    });

    suite('successor', function () {
      test('initially contains information on the node itself.', function (done) {
        assert.that(peer.successor).is.equalTo({
          host: 'localhost',
          port: 3000,
          id: getId('localhost:3000')
        });
        done();
      });
    });

    suite('predecessor', function () {
      test('initially contains information on the node itself.', function (done) {
        assert.that(peer.predecessor).is.equalTo({
          host: 'localhost',
          port: 3000,
          id: getId('localhost:3000')
        });
        done();
      });
    });

    suite('successors', function () {
      test('is initially empty.', function (done) {
        assert.that(peer.successors).is.equalTo([]);
        done();
      });
    });

    suite('fingers', function () {
      test('is initially empty.', function (done) {
        assert.that(peer.fingers).is.equalTo([]);
        done();
      });
    });

    suite('handle', function () {
      test('is an empty object.', function (done) {
        assert.that(peer.handle).is.equalTo({});
        done();
      });
    });

    suite('remote', function () {
      test('is a function.', function (done) {
        assert.that(peer.remote).is.ofType('function');
        done();
      });

      test('throws an error if target is missing.', function (done) {
        assert.that(function () {
          peer.remote();
        }).is.throwing('Target is missing.');
        done();
      });

      test('throws an error if host is missing.', function (done) {
        assert.that(function () {
          peer.remote({ port: 3000 });
        }).is.throwing('Host is missing.');
        done();
      });

      test('throws an error if port is missing.', function (done) {
        assert.that(function () {
          peer.remote({ host: 'localhost' });
        }).is.throwing('Port is missing.');
        done();
      });

      suite('run', function () {
        test('is a function.', function (done) {
          assert.that(peer.remote({ host: 'localhost', port: 3000 }).run).is.ofType('function');
          done();
        });
      });
    });

    suite('setSuccessor', function () {
      test('is a function.', function (done) {
        assert.that(peer.setSuccessor).is.ofType('function');
        done();
      });

      test('throws an error if successor is missing.', function (done) {
        assert.that(function () {
          peer.setSuccessor();
        }).is.throwing('Successor is missing.');
        done();
      });

      test('throws an error if the host is missing.', function (done) {
        assert.that(function () {
          peer.setSuccessor({ port: 3000 });
        }).is.throwing('Host is missing.');
        done();
      });

      test('throws an error if the port is missing.', function (done) {
        assert.that(function () {
          peer.setSuccessor({ host: 'localhost' });
        }).is.throwing('Port is missing.');
        done();
      });

      test('sets the successor to the given successor.', function (done) {
        peer.setSuccessor({ host: 'example.com', port: 3000 });
        assert.that(peer.successor).is.equalTo({
          host: 'example.com',
          port: 3000,
          id: 'f8f595e2159543d3b9dd3f3ebbe48d4faa0819f1'
        });
        done();
      });

      test('emits a changed::successor event.', function (done) {
        peer.once('changed::successor', function (successor) {
          assert.that(successor).is.equalTo({
            host: 'example.com',
            port: 3000,
            id: 'f8f595e2159543d3b9dd3f3ebbe48d4faa0819f1'
          });
          done();
        });
        peer.setSuccessor({ host: 'example.com', port: 3000 });
      });
    });

    suite('setPredecessor', function () {
      test('is a function.', function (done) {
        assert.that(peer.setPredecessor).is.ofType('function');
        done();
      });

      test('throws an error if the host is missing.', function (done) {
        assert.that(function () {
          peer.setPredecessor({ port: 3000 });
        }).is.throwing('Host is missing.');
        done();
      });

      test('throws an error if the port is missing.', function (done) {
        assert.that(function () {
          peer.setPredecessor({ host: 'localhost' });
        }).is.throwing('Port is missing.');
        done();
      });

      test('sets the predecessor to the given predecessor.', function (done) {
        peer.setPredecessor({ host: 'example.com', port: 3000 });
        assert.that(peer.predecessor).is.equalTo({
          host: 'example.com',
          port: 3000,
          id: 'f8f595e2159543d3b9dd3f3ebbe48d4faa0819f1'
        });
        done();
      });

      test('sets the predecessor to undefined if no predecessor is given.', function (done) {
        peer.setPredecessor();
        assert.that(peer.predecessor).is.undefined();
        done();
      });

      test('emits a changed::predecessor event.', function (done) {
        peer.once('changed::predecessor', function (predecessor) {
          assert.that(predecessor).is.equalTo({
            host: 'example.com',
            port: 3000,
            id: 'f8f595e2159543d3b9dd3f3ebbe48d4faa0819f1'
          });
          done();
        });
        peer.setPredecessor({ host: 'example.com', port: 3000 });
      });

      test('emits a changed::predecessor event when the predecessor is set to undefined.', function (done) {
        peer.once('changed::predecessor', function (predecessor) {
          assert.that(predecessor).is.undefined();
          done();
        });
        peer.setPredecessor();
      });
    });

    suite('status', function () {
      test('is a function.', function (done) {
        assert.that(peer.status).is.ofType('function');
        done();
      });

      test('returns lonely if the node only knows about itself.', function (done) {
        peer.setSuccessor({ host: peer.self.host, port: peer.self.port });
        peer.setPredecessor({ host: peer.self.host, port: peer.self.port });

        assert.that(peer.status()).is.equalTo('lonely');
        done();
      });

      test('returns joined if the node is not connected to itself.', function (done) {
        peer.setSuccessor({ host: 'example.com', port: 3000 });
        peer.setPredecessor({ host: 'example.com', port: 3000 });

        assert.that(peer.status()).is.equalTo('joined');
        done();
      });

      suite('returns unbalanced if the node', function () {
        suite('is its own successor and it', function () {
          test('does not have a predecessor.', function (done) {
            peer.setSuccessor({ host: peer.self.host, port: peer.self.port });
            peer.setPredecessor();

            assert.that(peer.status()).is.equalTo('unbalanced');
            done();
          });

          test('does have a predecessor other than itself.', function (done) {
            peer.setSuccessor({ host: peer.self.host, port: peer.self.port });
            peer.setPredecessor({ host: 'example.com', port: 3000 });

            assert.that(peer.status()).is.equalTo('unbalanced');
            done();
          });
        });

        suite('does have a successor other than itself and it', function () {
          test('does not have a predecessor.', function (done) {
            peer.setSuccessor({ host: 'example.com', port: 3000 });
            peer.setPredecessor();

            assert.that(peer.status()).is.equalTo('unbalanced');
            done();
          });

          test('is its own predecessor.', function (done) {
            peer.setSuccessor({ host: 'example.com', port: 3000 });
            peer.setPredecessor({ host: peer.self.host, port: peer.self.port });

            assert.that(peer.status()).is.equalTo('unbalanced');
            done();
          });
        });
      });
    });

    suite('fixSuccessor', function () {
      test('is a function.', function (done) {
        assert.that(peer.fixSuccessor).is.ofType('function');
        done();
      });

      test('sets itself as its successor if the successors list is empty.', function (done) {
        peer.setSuccessor({ host: 'example.com', port: 3000 });
        peer.successors = [];

        peer.fixSuccessor();

        assert.that(peer.successor).is.equalTo(peer.self);
        done();
      });

      test('sets itself as its successor if the successors list only has one element.', function (done) {
        peer.setSuccessor({ host: 'example.com', port: 3000 });
        peer.successors = [{ host: 'foo.com', port: 3000 }];

        peer.fixSuccessor();

        assert.that(peer.successor).is.equalTo(peer.self);
        done();
      });

      test('sets a new successor if the successors list has two elements.', function (done) {
        peer.setSuccessor({ host: 'example.com', port: 3000 });
        peer.successors = [
          { host: 'foo.com', port: 3000 },
          { host: 'bar.com', port: 3000 }
        ];

        peer.fixSuccessor();

        assert.that(peer.successor).is.equalTo({
          host: 'bar.com',
          port: 3000,
          id: '73b2c872ab0f76bc74f7f4d48a688d239c65ec4b'
        });
        done();
      });

      test('sets a new successor if the successors list has more than two elements.', function (done) {
        peer.setSuccessor({ host: 'example.com', port: 3000 });
        peer.successors = [
          { host: 'foo.com', port: 3000 },
          { host: 'bar.com', port: 3000 },
          { host: 'baz.com', port: 3000 },
          { host: 'bas.com', port: 3000 }
        ];

        peer.fixSuccessor();

        assert.that(peer.successor).is.equalTo({
          host: 'bar.com',
          port: 3000,
          id: '73b2c872ab0f76bc74f7f4d48a688d239c65ec4b'
        });
        done();
      });
    });

    suite('join', function () {
      test('is a function.', function (done) {
        assert.that(peer.join).is.ofType('function');
        done();
      });

      test('throws an error if options are missing.', function (done) {
        assert.that(function () {
          peer.join();
        }).is.throwing('Options are missing.');
        done();
      });

      test('throws an error if the host is missing.', function (done) {
        assert.that(function () {
          peer.join({ port: 3000 });
        }).is.throwing('Host is missing.');
        done();
      });

      test('throws an error if the port is missing.', function (done) {
        assert.that(function () {
          peer.join({ host: 'localhost' });
        }).is.throwing('Port is missing.');
        done();
      });

      test('throws an error if the callback is missing.', function (done) {
        assert.that(function () {
          peer.join({ host: 'localhost', port: 3000 });
        }).is.throwing('Callback is missing.');
        done();
      });

      test('calls join with the given node.', function (done) {
        var scope = nock('https://localhost:3000').
          post('/join', { host: 'example.com', port: 3000 }).
          reply(200);

        peer.join({ host: 'example.com', port: 3000 }, function (err) {
          assert.that(err).is.null();
          assert.that(scope.isDone()).is.true();
          done();
        });
      });

      test('returns an error if the join fails.', function (done) {
        var scope = nock('https://localhost:3000').
          post('/join', { host: 'example.com', port: 3000 }).
          reply(500);

        peer.join({ host: 'example.com', port: 3000 }, function (err) {
          assert.that(err).is.not.null();
          assert.that(err.message).is.equalTo('Failed to join.');
          assert.that(scope.isDone()).is.true();
          done();
        });
      });
    });

    suite('getPeerFor', function () {
      test('is a function.', function (done) {
        assert.that(peer.getPeerFor).is.ofType('function');
        done();
      });

      test('throws an error if value is missing.', function (done) {
        assert.that(function () {
          peer.getPeerFor();
        }).is.throwing('Value is missing.');
        done();
      });

      test('throws an error if callback is missing.', function (done) {
        assert.that(function () {
          peer.getPeerFor('foo');
        }).is.throwing('Callback is missing.');
        done();
      });

      test('calls findSuccessor with the id of the given value.', function (done) {
        var scopeFindSuccessor = nock('https://localhost:3000').
          post('/find-successor', { id: '0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33' }).
          reply(200, {
            host: 'example.com',
            port: 3000,
            id: getId('example.com:3000')
          });

        var scopeMetadata = nock('https://example.com:3000').
          post('/metadata').
          reply(200, { foo: 'bar' });

        peer.getPeerFor('foo', function (err, node, metadata) {
          assert.that(err).is.null();
          assert.that(node).is.equalTo({
            host: 'example.com',
            port: 3000,
            id: getId('example.com:3000')
          });
          assert.that(metadata).is.equalTo({
            foo: 'bar'
          });
          assert.that(scopeFindSuccessor.isDone()).is.true();
          assert.that(scopeMetadata.isDone()).is.true();
          done();
        });
      });

      test('returns an error if findSuccessor fails.', function (done) {
        var scope = nock('https://localhost:3000').
          post('/find-successor', { id: '0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33' }).
          reply(500);

        peer.getPeerFor('foo', function (err) {
          assert.that(err).is.not.null();
          assert.that(scope.isDone()).is.true();
          done();
        });
      });
    });
  });
});
