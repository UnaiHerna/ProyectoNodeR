import random
import sys

def get_random_number_in_range(start, end):
    return random.randint(start, end)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 random_number.py <start> <end>")
        sys.exit(1)
    
    start = int(sys.argv[1])
    end = int(sys.argv[2])
    
    print(get_random_number_in_range(start, end))