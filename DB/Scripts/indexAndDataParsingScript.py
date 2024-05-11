import csv

file_header_list = ["noun", "verb", "adv", "adj"]

ignore_count = int(input("how many words in to ignore in the index files: "))


#first we start by reading all of the data from "English Word Frequency.csv" file to know the use_rate of the words
frequency_dic = {}
NUM_OF_FREQUENCY_WORDS = 333333
with open("English Word Frequency.csv", 'r') as frequency_file:
    frequency_reader = csv.reader(frequency_file)
    for i, line in enumerate(frequency_reader):
        #to ignore the headers, we need to start from i=1 (ignore the first line which contains the headers)
        if i>0:
            #the "English Word Frequency.csv" file is sorted by highest use rate
            frequency_dic[line[0]] = int(i) 
            print("finished reading English Word Frequency.csv line", i,"out of", NUM_OF_FREQUENCY_WORDS, round((100*float(i))/NUM_OF_FREQUENCY_WORDS, 2),'%')


for i, header in enumerate(file_header_list):
    
    #the files are saved in this format "index." + TYPE
    input_file_path = "index." + header

    with open(input_file_path, 'r') as input_file, open("words.csv", 'a', newline='') as words_output_file, open("used in.csv", 'a', newline='') as usedIn_output_file:
        words_csv_writer = csv.writer(words_output_file)
        usedIn_csv_writer = csv.writer(usedIn_output_file)
        
        #define the table's columns 
        if i == 0:
            words_csv_writer.writerow(["Word", "Length", "Use_rate"])
            usedIn_csv_writer.writerow(["Word", "Index"])
            
        # counter for the number of indexes read in the file
        j = 1   
        #set of all words we ignored in this file
        ignored_words = set()     
        for line in input_file:
            #ignore the first 30 lines of the file, they don't contain data
            if j<30:
                j+=1
                continue
            tokens = line.strip().split()
            word = tokens[0]            
            #remember which words we ignored so that we don't accidentaly add them as primes in our "Context" table
            if j < ignore_count + 30:
                ignored_words.add(word)
                j+=1
                continue
            #ignore words of size 1 or 2 as they are usually not actual words
            if len(word) <=2:
                ignored_words.add(word)
                j+=1
                continue

            num_of_indexes = int(tokens[2])
            indexes = tokens[(len(tokens) - num_of_indexes):(len(tokens))]
            Length = len(word.replace('_',""))
            
            #if we have a use_rate for this word, save it 
            if word in frequency_dic:
                Use_rate= frequency_dic[word]
            else:
                Use_rate = NUM_OF_FREQUENCY_WORDS + 2
                NUM_OF_FREQUENCY_WORDS += 1

            words_csv_writer.writerow([word, Length, Use_rate])
            
            for index in indexes:
                index = int(index) + i * 10**9 #making the indexes unique between different files
                usedIn_csv_writer.writerow([word, index])
                print("indexes created so far from",input_file_path,j) #remove after done debugging
                j+=1
    #the files are saved in this format "index." + TYPE
    input_file_path = "data." + header
    with open(input_file_path, 'r') as input_file, open("context.csv", 'a', newline='') as output_file:
        deli = '>'
        csv_writer = csv.writer(output_file, delimiter=deli)
        
        #define the table's columns 
        if i == 0:
            csv_writer.writerow(["Index", "Type", "Example_sentence", "Definition", "Size"])

        # counter for the row number
        j = 1        

        for line in input_file:
            #ignore the first 30 lines of the file, they don't contain data
            if j<30:
                j+=1
                continue
            
            tokens = line.strip().split()
            
            Size = int(tokens[3], base=16)
            
            #IMPORTANT, we chose to not add this "prime" value to our final table, this variable will be ignored later
            Prime = tokens[4].lower().split("(")[0]
             
            #ignore all of the prime words that we did not include in our index table
            if Prime in ignored_words:
                #try to find a different prime
                possible_primes = []
                temp_tokens = line.strip().split('|')[0].lower().strip().split()[4:]
                for r in range(len(temp_tokens) - 1):
                    #check if the word starts with an english letter
                    if  97 <= ord(temp_tokens[r][0]) <=122 and len(temp_tokens[r]) > 2:
                        possible_primes.append(temp_tokens[r].split("(")[0])
                    r += 1
                flag = "no switch"
                for possible_prime in possible_primes:
                    if possible_prime not in ignored_words:
                        Prime = possible_prime
                        flag = "switch"
                        break                        
                if flag == "no switch":
                    #if we didnt find a new prime, ignore this index
                    continue                
            Index = int(tokens[0]) + i * 10**9 #making the indexes unique between different files
            Type = tokens[2]        
            Definition = line.split("|")[1].split('"',maxsplit=1)[0].strip()
            if len(line.split("|")[1].split('"',maxsplit=1)) > 1:
                Example = line.split("|")[1].split('"',maxsplit=1)[1].strip().replace('"',"")
            else:
                Example = ""                            
            csv_writer.writerow([Index, Type, Example, Definition, Size])
            print("line",j,"in file", '"' + input_file_path + '"',"was parsed succesfully") #remove after done debugging
            j+=1


            
            
            

