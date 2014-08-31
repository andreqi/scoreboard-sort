require 'json'

File.open('data.in', 'r') do |f|
  contest = []
  f.each_line do |line|
    tokens = line.split ' '
    name = tokens[0]
    tokens[1..-1].each_with_index do |points, index|
      if contest.length <= index 
        contest << []
      end
      contest[index] << {:handle => name, :points => points.to_f}
    end
  end
  print JSON.generate contest
end
