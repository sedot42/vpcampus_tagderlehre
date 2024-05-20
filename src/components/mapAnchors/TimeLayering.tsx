class MinHeap<T> {
  private heap: T[];
  private comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.heap = [];
    this.comparator = comparator;
  }

  insert(item: T): void {
    this.heap.push(item);
    this.bubbleUp();
  }

  private bubbleUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIndex]) >= 0) break;
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  extractMin(): T | undefined {
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return min;
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    let left: number, right: number, smallest: number;
    while (true) {
      left = 2 * index + 1;
      right = 2 * index + 2;
      smallest = index;

      if (left < length && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }

      if (right < length && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  peek(): T | undefined {
    return this.heap[0];
  }
}

interface Dictionary {
  id: string;
  startTime: number;
  endTime: number;
  display: string;
  lat: number;
  lon: number;
  floor: number;
  layerIndex?: number; // Optional property to store the layer index
}

function arrangeDictionaries(dictionaries: Dictionary[]): Dictionary[][] {
  // Sort dictionaries by their start time
  dictionaries.sort((a, b) => a.startTime - b.startTime);

  const layers: Dictionary[][] = [];
  const endTimeHeap = new MinHeap<Dictionary>((a, b) => a.endTime - b.endTime);

  // Iterate through each dictionary to place it in the appropriate layer
  for (const dict of dictionaries) {
    // If the earliest ending layer is available, reuse it
    if (!endTimeHeap.isEmpty() && endTimeHeap.peek()!.endTime <= dict.startTime) {
      const freeLayer = endTimeHeap.extractMin()!;
      layers[freeLayer.layerIndex!].push(dict);
      dict.layerIndex = freeLayer.layerIndex;
    } else {
      // If no available layer, create a new layer
      dict.layerIndex = layers.length;
      layers.push([dict]);
    }
    // Insert the dictionary into the heap to track its end time
    endTimeHeap.insert(dict);
  }

  return layers;
}

export { MinHeap, arrangeDictionaries };
