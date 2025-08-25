class StaticLayoutExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Static Layout Example')),
      body: Column(
        children: [
          Container(
            color: Colors.red,
            width: double.infinity,
            height: 100,
            child: Center(child: Text('Header')),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Icon(Icons.home),
              Icon(Icons.search),
              Icon(Icons.settings),
            ],
          ),
          Padding(
            padding: EdgeInsets.all(16.0),
            child: Text('This is a static layout example.'),
          ),
        ],
      ),
    );
  }
}
