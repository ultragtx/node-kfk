
const crypto = require('crypto')
const bluebird = require('bluebird')
const KafkaAMOConsumer = require('../dist/src').KafkaAMOConsumer
const KfkErrorCode = require('../dist/src').KfkErrorCode

const main = async () => {
  console.log('start')

  const consumer = new KafkaAMOConsumer({
    'group.id': 'amo-consumer-test-1',
    'metadata.broker.list': '127.0.0.1:9092',
    'auto.offset.reset': 'largest',
    'enable.auto.offset.store': true,
    'auto.commit.interval.ms': 500,
    'enable.auto.commit': true,
  }, {})
  await consumer.connect()
  await consumer.subscribe([
    'rdkafka-test0',
    // 'rdkafka-test1',
    // 'rdkafka-test2',
  ])

  while (true) {
    console.log('=============')
    try {
      await consumer.consume(message => {
        console.log(`topic: ${message.topic} offset : ${message.offset} val: ${message.value.toString('utf-8')}`)
      }, {
          size: 10,
          concurrency: 5,
        })
    } catch (e) {
      JSON.stringify({
        message: e.message,
        code: e.code,
      })
      return
    }
    await bluebird.delay(1000 * 1)
  }
}

main()
