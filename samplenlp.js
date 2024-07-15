const { NlpManager } = require('node-nlp');

// NLPマネージャーを作成
const manager = new NlpManager({ languages: ['en'] });

// トレーニングデータを追加
manager.addDocument('en', 'I want to book a flight', 'flight.book');
manager.addDocument('en', 'I need a flight ticket', 'flight.book');
manager.addDocument('en', 'Do you have flights to New York?', 'flight.search');
manager.addDocument('en', 'Show me flight options', 'flight.search');

// 応答を追加
manager.addAnswer('en', 'flight.book', 'Sure, I can help you book a flight.');
manager.addAnswer('en', 'flight.search', 'Here are some flight options for you.');

// トレーニングと保存
(async () => {
  await manager.train();
  manager.save();

  // テキストを処理して意図を判定
  const response = await manager.process('en', 'I want to book a flight to New York');
  console.log(response);
})();
