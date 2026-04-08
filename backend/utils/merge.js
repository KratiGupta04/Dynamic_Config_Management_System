const isObject = (item) => {
         return (item && typeof item === 'object' && !Array.isArray(item));
};

const deepMerge = (target, ...sources) => {
         if (!sources.length) return target;
         const source = sources.shift();

         if (isObject(target) && isObject(source)) {
                  const output = { ...target };
                  for (const key in source) {
                           if (isObject(source[key])) {
                                    if (!output[key]) {
                                             output[key] = { ...source[key] };
                                    } else {
                                             output[key] = deepMerge(output[key], source[key]);
                                    }
                           } else {
                                    output[key] = source[key];
                           }
                  }
                  return deepMerge(output, ...sources);
         }

         return deepMerge(target, ...sources);
};

module.exports = deepMerge;
