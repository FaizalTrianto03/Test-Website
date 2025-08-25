class StatelessCounterApp extends StatelessWidget {
  int counter = 0; // Variabel statis, tidak akan berubah

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Stateless Counter')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Counter: $counter'),
              ElevatedButton(
                onPressed: () {
                  counter++; // Tidak akan memperbarui UI
                  print('Counter: $counter');
                },
                child: Text('Increment'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
