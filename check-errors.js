/**
 * 项目错误检测脚本
 * 用于遍历项目文件并输出所有报错文本，检查错误处理格式的一致性
 */

const fs = require('fs');
const path = require('path');

// 定义要检查的目录
const PROJECT_DIR = path.join(__dirname);
const EXCLUDE_DIRS = ['node_modules', '.git', '_data'];
const INCLUDE_EXTENSIONS = ['.js'];

// 定义错误处理相关的关键词和正则表达式
const ERROR_PATTERNS = [
  // 查找所有的错误响应模式
  { pattern: /APIUnsuccessful\(\d+,\s*['"].*?['"]\)/g, name: 'APIUnsuccessful方法调用' },
  { pattern: /success:\s*false/g, name: 'success: false响应' },
  { pattern: /\.status\(\d+\)\.json\(/g, name: 'HTTP状态码响应' },
  { pattern: /error:\s*{/g, name: 'error对象' },
  { pattern: /code:\s*['"]?\d+['"]?/g, name: '错误代码' },
  { pattern: /message:\s*['"].*?['"]/g, name: '错误消息' },
  { pattern: /description:\s*['"].*?['"]/g, name: '错误描述' }
];

// 存储找到的错误处理信息
const errorResults = [];

/**
 * 递归遍历目录，检查文件中的错误处理代码
 * @param {string} dir - 要遍历的目录路径
 */
function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // 检查是否为目录且不在排除列表中
    if (stat.isDirectory() && !EXCLUDE_DIRS.includes(file)) {
      traverseDirectory(fullPath);
    }
    // 检查是否为JavaScript文件
    else if (stat.isFile() && INCLUDE_EXTENSIONS.includes(path.extname(file))) {
      checkFileForErrors(fullPath);
    }
  });
}

/**
 * 检查单个文件中的错误处理代码
 * @param {string} filePath - 要检查的文件路径
 */
function checkFileForErrors(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(PROJECT_DIR, filePath);
    
    // 检查每个错误模式
    ERROR_PATTERNS.forEach(({ pattern, name }) => {
      let match;
      const matches = [];
      
      // 查找所有匹配项
      while ((match = pattern.exec(content)) !== null) {
        // 获取匹配行号
        const lines = content.substring(0, match.index).split('\n');
        const lineNumber = lines.length;
        
        matches.push({
          match: match[0],
          line: lineNumber
        });
        
        // 避免无限循环
        if (match.index === pattern.lastIndex) {
          pattern.lastIndex++;
        }
      }
      
      // 如果有匹配项，添加到结果中
      if (matches.length > 0) {
        errorResults.push({
          file: relativePath,
          pattern: name,
          matches: matches
        });
      }
    });
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error);
  }
}

/**
 * 格式化并输出检测结果
 */
function formatAndOutputResults() {
  console.log('=== 项目错误处理检测结果 ===\n');
  
  if (errorResults.length === 0) {
    console.log('未发现任何错误处理代码');
    return;
  }
  
  // 按文件分组结果
  const resultsByFile = {};
  errorResults.forEach(result => {
    if (!resultsByFile[result.file]) {
      resultsByFile[result.file] = [];
    }
    resultsByFile[result.file].push(result);
  });
  
  // 输出每个文件的结果
  Object.keys(resultsByFile).forEach(file => {
    console.log(`文件: ${file}`);
    console.log('------------------------');
    
    resultsByFile[file].forEach(result => {
      console.log(`  ${result.pattern} (${result.matches.length}处):`);
      result.matches.forEach(match => {
        console.log(`    行 ${match.line}: ${match.match}`);
      });
      console.log();
    });
    
    console.log();
  });
  
  // 生成统计信息
  console.log('=== 统计信息 ===');
  console.log(`检查的文件数: ${Object.keys(resultsByFile).length}`);
  console.log(`找到的错误处理模式数: ${errorResults.length}`);
  
  // 检查是否存在不一致的错误格式
  checkForInconsistencies();
}

/**
 * 检查是否存在不一致的错误格式
 */
function checkForInconsistencies() {
  console.log('\n=== 格式一致性检查 ===');
  
  const hasOldErrorFormat = errorResults.some(result => 
    result.pattern === 'success: false响应' && 
    !errorResults.some(r => r.pattern === 'APIUnsuccessful方法调用' && r.file === result.file)
  );
  
  if (hasOldErrorFormat) {
    console.log('警告: 检测到可能存在不一致的错误处理格式，有些文件可能使用了旧的错误格式而不是统一的APIUnsuccessful方法');
  } else {
    console.log('所有文件的错误处理格式看起来是一致的');
  }
}

// 执行检测
console.log('开始检测项目中的错误处理代码...\n');
traverseDirectory(PROJECT_DIR);
formatAndOutputResults();

console.log('=== 检测完成 ===');