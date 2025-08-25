class StatefulCounterApp extends StatefulWidget {
  @override
  _StatefulCounterAppState createState() => _StatefulCounterAppState();
}

class _StatefulCounterAppState extends State<StatefulCounterApp> {
  int _counter = 0; // Variabel state untuk menyimpan angka

  void _incrementCounter() {
    setState(() {
      _counter++; // Memperbarui angka dan UI
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Stateful Counter')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Counter: $_counter'),
              ElevatedButton(
                onPressed: _incrementCounter,
                child: Text('Increment'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
